var btn = document.getElementById("button");
var ExpensesList = document.querySelector('ul');

document.getElementById('button').addEventListener('click', createList);
window.addEventListener("DOMContentLoaded", async() => {
    
        try {
            const resp = await axios.get("https://crudcrud.com/api/ce8a0680486f43b5b6de34bf17bad791/Expenses")
            for (let i=0; i< resp.data.length;i++) {
            ShowExpenses(resp.data[i]);
        }
    } catch(err) {
        console.error(err);
    }
});


 async function createList(e) {
     
    const Amount = document.getElementById("amount").value;
    const Description = document.getElementById("description").value;
    const Category = document.getElementById("category").value;
    let newExpense = {Description, Category, Amount}
    
    
        try {            
            const resp =  await axios.post("https://crudcrud.com/api/ce8a0680486f43b5b6de34bf17bad791/Expenses", newExpense)
            ShowExpenses(newExpense);
        // console.log(resp.data);
        } catch(err) {
            console.error(err);
            }
    
}
// // const totalUsers = localStorage.getItem("userdetails")

// Creating a list and adding the user details
    function ShowExpenses(obj) {
    var newExpenseItem = document.createElement('li');
    newExpenseItem.className = "items";
    newExpenseItem.textContent = `${obj.Description} ${obj.Category} ${obj.Amount} `
    newExpenseItem.id = `${obj._id}`
    ExpensesList.appendChild(newExpenseItem)
    // Adding a edit button
    var EditBtn = document.createElement('button');
    EditBtn.textContent = "Edit";
    EditBtn.id = "edit-btn";
    EditBtn.className = "edit-btn";
    newExpenseItem.appendChild(EditBtn);
    //Adding a delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.id = "del-btn";
    deleteBtn.className = "del-btn";
    newExpenseItem.appendChild(deleteBtn);
    }

//Editing an item
document.getElementById('expenses').addEventListener('click', changelist);
async function changelist(e){
    e.preventDefault();
    
    //deleting an item
    if(e.target.classList.contains('del-btn')){
        
            try {
                const expenseID = e.target.parentElement.id;
                const li = e.target.parentElement;
                const resp = await axios.delete(`https://crudcrud.com/api/ce8a0680486f43b5b6de34bf17bad791/Expenses/${expenseID}`)
                ExpensesList.removeChild(li);
                } catch(err) {
                    console.error(err);
                    }
            
        }

    //Editing an item

    else if(e.target.classList.contains('edit-btn')) {
        try {
                const expenseID = e.target.parentElement.id;
                const li = e.target.parentElement;
            //    const resp = await axios.get(`https://crudcrud.com/api/ce8a0680486f43b5b6de34bf17bad791/Expenses/${expenseID}`)
               
                const exp = li.textContent.split(" ")            
        
                const resp = await axios.delete(`https://crudcrud.com/api/ce8a0680486f43b5b6de34bf17bad791/Expenses/${expenseID}`)
                document.getElementById('description').value = exp[0];
               document.getElementById('category').value = exp[1];
               document.getElementById('amount').value = exp[2];
                ExpensesList.removeChild(li);
                } catch(err) {
                    console.error(err);
                    }
            
        }
}