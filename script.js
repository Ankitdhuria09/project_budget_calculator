let balance = 0;
let totalIncome = 0;
let totalExpenses = 0;

document.getElementById('addIncome').addEventListener('click', function() {
    addTransaction('income');
});

document.getElementById('addExpense').addEventListener('click', function() {
    addTransaction('expense');
});

document.getElementById('clearData').addEventListener('click', clearData); // Add event listener for Clear Data button

function addTransaction(type) {
    let description = document.getElementById('description').value.trim();
    let amount = parseFloat(document.getElementById('amount').value);

    const feedbackElement = document.getElementById('feedback');

    // Use a default description if none is provided
    if (!description) {
        description = "No description";
    }

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
        feedbackElement.textContent = "Please enter a valid amount.";
        return;
    }

    // Update totals based on the type of transaction
    if (type === 'income') {
        totalIncome += amount;
        balance += amount;
    } else if (type === 'expense') {
        totalExpenses += amount;
        balance -= amount;
    }

    feedbackElement.textContent = ""; // Clear feedback
    updateValues(); // Update the display values
    addTransactionToList(description, amount, type); // Add to the transaction list
    clearInputs(); // Clear the input fields
    saveTransactions(); // Save data to local storage
}

function updateValues() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);

    const balanceElement = document.getElementById('balance');
    balanceElement.style.color = balance >= 0 ? '#4CAF50' : '#f44336';
}

function addTransactionToList(description, amount, type) {
    const transactionList = document.getElementById('transactionList');
    const transactionItem = document.createElement('li');

    transactionItem.classList.add(type);
    transactionItem.innerHTML = `${description}: ₹${amount.toFixed(2)} <button onclick="removeTransaction(this, ${amount}, '${type}')">&times;</button>`;

    transactionList.appendChild(transactionItem);
    saveTransactions(); // Save after adding a transaction
}

function removeTransaction(element, amount, type) {
    element.parentElement.remove();

    if (type === 'income') {
        totalIncome -= amount;
        balance -= amount;
    } else if (type === 'expense') {
        totalExpenses -= amount;
        balance += amount;
    }

    updateValues();
    saveTransactions(); // Save after removing a transaction
}

function clearInputs() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function saveTransactions() {
    const transactions = document.getElementById('transactionList').innerHTML;
    localStorage.setItem('transactions', transactions);
    localStorage.setItem('balance', balance);
    localStorage.setItem('totalIncome', totalIncome);
    localStorage.setItem('totalExpenses', totalExpenses);
}

function loadTransactions() {
    const transactions = localStorage.getItem('transactions');
    if (transactions) {
        document.getElementById('transactionList').innerHTML = transactions;
        balance = parseFloat(localStorage.getItem('balance'));
        totalIncome = parseFloat(localStorage.getItem('totalIncome'));
        totalExpenses = parseFloat(localStorage.getItem('totalExpenses'));
        updateValues();
    }
}

function clearData() {
    // Reset all values
    balance = 0;
    totalIncome = 0;
    totalExpenses = 0;

    // Update the display
    updateValues();

    // Clear the transaction list
    document.getElementById('transactionList').innerHTML = '';

    // Clear local storage
    localStorage.removeItem('transactions');
    localStorage.removeItem('balance');
    localStorage.removeItem('totalIncome');
    localStorage.removeItem('totalExpenses');
}

// Load transactions when the page loads
document.addEventListener('DOMContentLoaded', loadTransactions);

document.getElementById('exportText').addEventListener('click', exportToText);

function exportToText() {
    const transactionListItems = document.querySelectorAll('#transactionList li');
    let transactionText = 'Transactions:\n';

    transactionListItems.forEach(item => {
        const type = item.classList.contains('income') ? 'Income' : 'Expense';
        const description = item.textContent.split(':')[0].trim();
        const amount = item.textContent.split('₹')[1].split(' ')[0].trim();

        transactionText += `${type}: ${description}: ₹${amount}\n`;
    });

    const balance = document.getElementById('balance').textContent;
    const totalIncome = document.getElementById('totalIncome').textContent;
    const totalExpenses = document.getElementById('totalExpenses').textContent;

    const data = `
Transactions:
${transactionText}
Balance: ₹${balance}
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpenses}`;

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget_data.txt';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

