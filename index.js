document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseInput = document.getElementById('expense');
    const descriptionInput = document.getElementById('description');
    const editIndexInput = document.getElementById('edit-index');
    const expenseList = document.getElementById('expense-list');
    const clearBtn = document.getElementById('clear-btn');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    renderExpenses();

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const expenseAmount = parseFloat(expenseInput.value);
        const description = descriptionInput.value.trim();
        if (isNaN(expenseAmount) || description === '') {
            alert('Please enter a valid amount and description.');
            return;
        }

        const editIndex = parseInt(editIndexInput.value);
        if (editIndex === -1) {
            addExpense(expenseAmount, description);
        } else {
            editExpense(editIndex, expenseAmount, description);
        }

        expenseInput.value = '';
        descriptionInput.value = '';
        editIndexInput.value = -1;
    });

    clearBtn.addEventListener('click', function() {
        clearForm();
    });

    function renderExpenses() {
        expenseList.innerHTML = '';
        let total = 0;
        expenses.forEach(function(expense, index) {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            if (index === parseInt(editIndexInput.value)) {
                expenseItem.classList.add('editing');
            }
            expenseItem.innerHTML = `
                <span>${expense.description} - $${expense.amount.toFixed(2)}</span>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            total += expense.amount;
            expenseList.appendChild(expenseItem);
        });
        document.getElementById('balance').textContent = Balance: $${total.toFixed(2)};
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function addExpense(amount, description) {
        expenses.push({ amount, description });
        renderExpenses();
    }

    function editExpense(index, amount, description) {
        expenses[index] = { amount, description };
        renderExpenses();
    }

    function clearForm() {
        expenseInput.value = '';
        descriptionInput.value = '';
        editIndexInput.value = -1;
    }

    expenseList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('edit-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            const { amount, description } = expenses[index];
            expenseInput.value = amount;
            descriptionInput.value = description;
            editIndexInput.value = index;
        } else if (target.classList.contains('delete-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            expenses.splice(index, 1);
            renderExpenses();
        }
    });
});