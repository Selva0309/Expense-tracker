const expenselist = document.querySelector('.expense-list');
var premium = localStorage.getItem('premium');

window.addEventListener('DOMContentLoaded',()=>{
    checkpremium();
    showexpense();
})

function addexpense() {
    const token = localStorage.getItem('token');
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    console.log(amount,description,category,token);
    axios.post('http://localhost:5000/expenses',{description: description, category:category, amount:amount},{headers: {"Authorization": token}})
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
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/expenselist', {headers: {"Authorization": token}})
    .then((response)=>{
       let expenses = response.data.result;
       console.log(expenses);
       if(expenses.length==0){
        expenselist.innerHTML=`<p>There is no expense to display</p>`
       } else {
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
    }
    })
}

function deleteexpense(id){
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/delete-expense',{expenseId: id}, {headers: {"Authorization": token}})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
        showexpense();
    })

}
async function razorpay() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/purchase/premiummembership', {headers: {"Authorization": token}})
    .then((response)=>{
        console.log(response);
    var options = {
            "key": response.data.key_id, // key ID generated from Razorpay,
            "order_id": response.data.order.id,
            "handler" : async function(response) {
                axios.post('http://localhost:5000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
            }, {headers: {"Authorization": token}})
            alert("You are a Premium user now")
            localStorage.setItem('premium', true);
            window.location.reload();
            }
    }

    const rzpy = new Razorpay(options);
    rzpy.open();
    

    rzpy.on('payment failed', function(response){
        console.log(response);
        alert('Something went wrong')
    })
    })
    

}

function checkpremium(){
    
    if (premium === 'true') {
        document.getElementById('rzp-button').style = 'display: none';
        document.querySelector('.header-nav').innerHTML = `
        <h1>EXPENSE TRACKER |</h1> <h4>PREMIUM USER</h4>
        `

    }
}

