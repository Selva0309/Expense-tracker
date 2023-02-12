
const dashboardlist = document.querySelector('.user-list');
const token = localStorage.getItem('token');
const overallcontainer = document.querySelector('.overall-progress');
const yearlycontainer = document.querySelector('.yearly-expense-list');
window.addEventListener('DOMContentLoaded',()=>{
    getdashboard();
    getreports();
    getmonthlyreport();
})

function showexpensepage(){
    window.location.assign('/Expenses.html');
}

function getdashboard(){
    axios.get('http://localhost:3000/premium/dashboard')
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
    
    axios.get('http://localhost:3000/premium/download', {headers: {"Authorization": token}})
    .then(response =>{
        console.log(response.data);
        getreports();
    })

}

function getreports(){
    const reportContainer = document.querySelector('.report-list')
    reportContainer.innerHTML=''; 
    axios.get('http://localhost:3000/premium/getreport',{headers: {"Authorization": token}})
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

function getmonthlyreport(){
    const token = localStorage.getItem('token');
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    let progress_data = { Income: {total:0, percentage: 0},
                        Expense: {total:0, percentage: 0},
                        Savings: {total:0, percentage : 0}} 
    // console.log(month, year);
    overallcontainer.innerHTML='';
    axios.get('http://localhost:3000/expenses/getmonthlyreport', {headers: {"Authorization": token}})
    .then(response =>{
        console.log(response.data);
        const expense_data = response.data;
        getyearlyreport(expense_data);
        expense_data.forEach(row=>{
            if((row.month== month) && (row.year==year)){
                if(row.type=="Income"){
                    progress_data.Income.total = progress_data.Income.total + parseInt(row.amount);
                }else{
                    progress_data.Expense.total = progress_data.Expense.total + parseInt(row.amount);
                }    
            }
            
        })
        progress_data.Savings.total = progress_data.Income.total  - progress_data.Expense.total;
        progress_data.Income.percentage = Math.round((progress_data.Income.total/progress_data.Income.total)*100)
        progress_data.Expense.percentage = Math.round((progress_data.Expense.total/progress_data.Income.total)*100)
        progress_data.Savings.percentage = progress_data.Income.percentage  - progress_data.Expense.percentage;
        // console.log(progress_data);
        for (let key in progress_data){
            let progress_item = document.createElement('div');
            progress_item.classList.add('progress-container');
            progress_item.innerHTML=`
            <div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="--value:${progress_data[key].percentage}"></div>
                    <span>${progress_data[key].total}</span>
                    <h4>${key}</h4>
            `
            overallcontainer.appendChild(progress_item)
        }
    })
      
}

function getyearlyreport(data){
    result = data.reduce(function(r,a){
        r[a.year] = r[a.year] || [];
        r[a.year].push(a);
        return r;   
    }, Object.create(null));
    console.log(result);
    yearlycontainer.innerHTML='';
    for (let year in result) {

        let income=savings=expense=0;
        for( let row in result[year]){
        if(result[year][row].type == 'Income'){
            income = income + parseInt(result[year][row].amount); 
        }else {
            expense = expense + parseInt(result[year][row].amount);    
        }
        }
        savings = income - expense;
        let expenseitem = document.createElement('li');
        expenseitem.classList.add('expense-item');
        expenseitem.innerHTML=`
                <div class='details'>
                    <div class='year'> ${year}</div>
                    <div class= 'income'> ${income}</div>
                    <div class='expense'> ${expense}</div>
                    <div class='savings'>${savings}</div>
                </div>
        
            `
        yearlycontainer.appendChild(expenseitem);    
        console.log(income, expense, savings);  
    }
     
}