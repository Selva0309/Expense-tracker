const pageContainer = document.getElementById('pagination');
const expenselist = document.querySelector('.expense-list');
const limit = localStorage.getItem('limit') || 3;

var premium = localStorage.getItem('premium');

window.addEventListener('DOMContentLoaded',()=>{
    checkpremium();
    showexpense(1);
    document.getElementById('pagelimit').value = limit;
})

function addexpense() {
    const token = localStorage.getItem('token');
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    console.log(amount,description,category,token);
    axios.post('http://52.196.64.49/expenses/addexpense',{description: description, category:category, type: type, amount:amount},{headers: {"Authorization": token}})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
        showexpense(1);
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

function showexpense(page){
    const token = localStorage.getItem('token');
    axios.get('http://52.196.64.49/expenses/expenselist', {headers: {"Authorization": token,'page':page, 'limit': limit }})
    .then((response)=>{
        // console.log(response);
       let expenses = response.data.result;
       let totalitems = expenses.length;
       
    //    console.log(expenses);
       if(totalitems==0){
        expenselist.innerHTML=`<p>There is no expense to display</p>`
       } else {
       expenselist.innerHTML='';
       let Pages =  response.data.pages;
    //    console.log(Pages);
        expenses.forEach(expense => {
                const id = expense.id;
                const description = expense.description;
                const category = expense.category;
                const amount = expense.amount;
                const type = expense.type;
                // console.log(id, description, category, amount, type);
        
                let expenseitem = document.createElement('li');
                if(type=='Income'){
                    expenseitem.classList.add('income-item');    
                }else{
                expenseitem.classList.add('expense-item');
                }
                expenseitem.setAttribute('id', `${id}`)
                expenseitem.innerHTML=`
                <div class='details'>
                    <div class='type'> ${type}</div>
                    <div class= 'category'> ${category}</div>
                    <div class='description'> ${description}</div>
                    <div class='amount'>${amount}</div>
                </div>
                <div class= 'button'>
                    <button class='del-btn' type='button' alt='delete'><i class="fa fa-trash" onclick='deleteexpense(${id})' ></i></button>
                </div> 
                `        
                expenselist.appendChild(expenseitem);
       });
            pageContainer.innerHTML='';
            
            for (let page in Pages){
                if(Pages[page].condition){
                    pageBtn = document.createElement('div');
                    pageBtn.classList.add('page-btn');
                    pageBtn.innerHTML = `
                    <button class='${page}' onclick='showexpense(${Pages[page].value})'>${Pages[page].name}</button>`
                    pageContainer.appendChild(pageBtn);
                    // console.log('Page added');
                }
            }
            
            }   
    })
} 

function deleteexpense(id){
    const token = localStorage.getItem('token');
    axios.post('http://52.196.64.49/expenses/delete-expense',{expenseId: id}, {headers: {"Authorization": token}})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
        showexpense();
    })

}
async function razorpay() {
    const token = localStorage.getItem('token');
    axios.get('http://52.196.64.49/purchase/premiummembership', {headers: {"Authorization": token}})
    .then((response)=>{
        console.log(response);
    var options = {
            "key": response.data.key_id, // key ID generated from Razorpay,
            "order_id": response.data.order.id,
            "handler" : async function(response) {
                axios.post('http://52.196.64.49/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    message: 'SUCCESSFUL',
                    premium : true
            }, {headers: {"Authorization": token}})
            alert('Congratulations!!! You are a premium user now')
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
        <h1>EXPENSE TRACKER </h1> <h4>PREMIUM USER</h4>
        `
        document.getElementById('premium-btn').style = 'display: block';

    }
}

function signout(){
    localStorage.clear();
    window.location.assign('/home.html')
}

function premiumfeatures(){
    window.location.assign('/Premiumfeatures.html');
   
}

function getdashboard(){
    axios.get('http://52.196.64.49/premium/dashboard')
    .then(response=>{
        console.log(response);
    })
}

function setlimit(){
    const limit = document.getElementById('pagelimit').value;
    localStorage.setItem('limit', limit);
    window.location.reload();
}