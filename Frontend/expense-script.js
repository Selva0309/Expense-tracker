const expenselist = document.querySelector('.expense-list');

window.addEventListener('DOMContentLoaded',()=>{
    showexpense();
})

function addexpense() {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    console.log(amount,description,category);
    axios.post('http://localhost:5000/expenses',{description: description, category:category, amount:amount})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
        showexpense();
    })

}

function notifyUser(message) {
    const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
            notification.innerHTML=`
            <h4>${message} </h4>
            `;
            container.appendChild(notification);
            container.style = 'display: block;'
            setTimeout(()=>{
                notification.remove();
                container.style = 'display: none;'
            },3500)
}

function showexpense(){
    axios.get('http://localhost:5000/expenselist')
    .then((response)=>{
       let expenses = response.data.result;
       console.log(expenses);
       expenselist.innerHTML='';
       expenses.forEach(expense => {
        const id = expense.id;
        const description = expense.description;
        const category = expense.category;
        const amount = expense.amount;
        
        let expenseitem = document.createElement('li');
        expenseitem.classList.add('expense-item');
        expenseitem.setAttribute('id', `${id}`)
        expenseitem.innerHTML=`
        <div class='details'>
            <div class= 'category'> ${category}</div>
            <div class='description'> ${description}</div>
            <div class='amount'>${amount}</div>
        </div>
        <div class= 'button'>
            <button class='del-btn' type='button' alt='delete expenses'><i class="fa fa-trash" onclick='deleteexpense(${id})' ></i></button>
        </div> 
        `        
        expenselist.appendChild(expenseitem);
       }); 
    })
}

function deleteexpense(id){
    axios.post('http://localhost:5000/delete-expense',{expenseId: id})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
        showexpense();
    })

}