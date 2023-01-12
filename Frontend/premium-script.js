const dashboardlist = document.querySelector('.user-list');
const token = localStorage.getItem('token');
window.addEventListener('DOMContentLoaded',()=>{
    getdashboard();
    getreports();
    
})

function showexpensepage(){
    window.location.assign('/Expenses.html');
}

function getdashboard(){
    axios.get('http://localhost:5000/premium/dashboard')
    .then(response=>{
        console.log(response.data);
        const dashboarduserdata = response.data;
    //     let userlist = []
        
    //     // console.log(GroupedExpenses, GroupedExpenses.length); 
    //     Object.values(GroupedExpenses).forEach(user => {
    //         let totalamount = 0;
    //         let username; 
    //         console.log(user);
    //         user.forEach(expense=>{
    //             totalamount = totalamount + expense.amount;
    //             username = expense.user.name;
    //         })
    //         userlist.push({'name': username, 'amount': totalamount});           
            
    //     });

    //     sortedList = userlist.sort((a,b)=> b.amount- a.amount);
    //     console.log(sortedList);
    dashboarduserdata.forEach(user=>{
            const userName = user.name;
            const expenseAmount = user.total_cost || 0;
            let userlistItem = document.createElement('li');
            userlistItem.classList.add('user-detail');
            userlistItem.innerHTML= `<span>${userName}</span><span>${expenseAmount}</span>`;
            dashboardlist.appendChild(userlistItem); 
        })
    });
      
}
function downloadreport(){
    
    axios.get('http://localhost:5000/premium/download', {headers: {"Authorization": token}})
    .then(response =>{
        console.log(response.data);
        getreports();
    })

}

function getreports(){
    const reportContainer = document.querySelector('.report-list')
    reportContainer.innerHTML=''; 
    axios.get('http://localhost:5000/premium/getreport',{headers: {"Authorization": token}})
    .then(response=>{
        const reports = response.data.userReports;
        console.log(reports);
        reports.forEach(report =>{
            const reportItem=document.createElement('li');
            
            
            reportItem.innerHTML = `<a href=${report.filename}>${report.createdAt}</a>`
            reportContainer.appendChild(reportItem);  

        })
    })
}

