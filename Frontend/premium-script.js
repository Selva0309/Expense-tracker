const dashboardlist = document.querySelector('.user-list');
window.addEventListener('DOMContentLoaded',()=>{
    getdashboard();
    
})

function showexpensepage(){
    window.location.assign('/Expenses.html');
}

function getdashboard(){
    axios.get('http://localhost:5000/premium/dashboard')
    .then(response=>{
        // console.log(response.data);
        const expensedata = response.data;
        let userlist = []
        let GroupedExpenses = expensedata.reduce((r,a)=>{
            r[a.userId] = r[a.userId] || [];
            r[a.userId].push(a);
            return r;
        }, {});
        // console.log(GroupedExpenses, GroupedExpenses.length); 
        Object.values(GroupedExpenses).forEach(user => {
            let totalamount = 0;
            let username; 
            console.log(user);
            user.forEach(expense=>{
                totalamount = totalamount + expense.amount;
                username = expense.user.name;
            })
            userlist.push({'name': username, 'amount': totalamount});           
            
        });

        sortedList = userlist.sort((a,b)=> b.amount- a.amount);
        console.log(sortedList);
        Object.values(sortedList).forEach(user=>{
            const userName = user.name;
            const expenseAmount = user.amount;
            let userlistItem = document.createElement('li');
            userlistItem.classList.add('user-detail');
            userlistItem.innerHTML= `<span>${userName}</span><span>${expenseAmount}</span>`;
            dashboardlist.appendChild(userlistItem); 
        })
    });
    
}

