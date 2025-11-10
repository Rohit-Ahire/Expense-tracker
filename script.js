const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    signDisplay: 'always',
});

const list = document.getElementById("transactionList");
const status = document.getElementById("status");
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

document
    .getElementById("transactionForm")
    .addEventListener("submit", addTransaction);

function updateTotol() {
    const incomeTotol = transactions
        .filter(trx => trx.type === 'income')
        .reduce((totol, trx) => totol + trx.amount, 0);

    const expenseTotol = transactions
        .filter(trx => trx.type === 'expense')
        .reduce((totol, trx) => totol + trx.amount, 0);

    const balanceTotol = incomeTotol - expenseTotol;

    balance.textContent = formatter.format(balanceTotol).substring(1);
    income.textContent = formatter.format(incomeTotol);
    expense.textContent = formatter.format(expenseTotol * -1);
}

function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        status.textContent = "No transactions.";
        return;
    } else {
        status.textContent = "";
    }

    transactions.forEach(({ id, name, amount, date, type }) => {
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div> 

            <div class="amount ${type}">
                <span>${formatter.format(amount)}</span>
            </div> 

            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;

        list.appendChild(li);
    });
}

updateTotol();
savetransactions();
renderList();

function deleteTransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);
    updateTotol();
    savetransactions();
    renderList();
}

function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData(this);

    transactions.push({
        id: transactions.length + 1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: formData.get("type") === 'on' ? "income" : "expense",
    });

    this.reset();

    updateTotol();
    savetransactions();
    renderList();
}

function savetransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem("transactions", JSON.stringify(transactions));
}
