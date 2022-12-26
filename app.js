const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const User = require('./model/user');
const Expenses = require('./model/Expenses');
const Order = require ('./model/orders');
const Uuid = require('./model/uuid-table');

const expenseroute = require('./routes/expenseroute');
const userroute= require('./routes/user-route');
const purchaseroute = require('./routes/purchase-route');
const premiumroute = require('./routes/premium-route');
const passwordroute = require('./routes/password')
var cors = require('cors');



const express = require('express');
// const sequelize = require('./util/database');

const app = express();
app.use(express.static(path.join(__dirname,'Frontend')));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cors());



app.get('/expenselist', expenseroute);
app.post('/expenses', expenseroute);
app.post('/edit-expense', expenseroute);
app.post('/update-expense', expenseroute);
app.post('/delete-expense', expenseroute);

app.post('/user/signup', userroute);
app.post('/user/login', userroute);
app.get('/purchase/premiummembership', purchaseroute)
app.post('/purchase/updatetransactionstatus', purchaseroute)
app.get('/premium/dashboard', premiumroute)
app.post('/password/forgotpassword', passwordroute)
app.use('/password/resetpassword/:id', passwordroute);
app.use('/password/updatepassword/:resetpasswordid',passwordroute);




app.use((req,res)=>{
    res.sendFile(path.join(__dirname, "Frontend/home.html"))
})

User.hasMany(Expenses);
Expenses.belongsTo(User);

Order.belongsTo(User);
User.hasMany(Order);

User.hasMany(Uuid);
Uuid.belongsTo(User);



sequelize.sync()
.then(result=>{

app.listen(5000);
})
.catch(err=>console.log(err));

