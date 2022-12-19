const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const Expenses = require('./model/Expenses');
const User = require('./model/user');
const expenseroute = require('./routes/expenseroute');
const userroute= require('./routes/user-route');
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



app.use((req,res)=>{
    res.sendFile(path.join(__dirname, "Frontend/home.html"))
})

User.hasOne(Expenses);
Expenses.belongsTo(User);

sequelize.sync()
.then(result=>{
console.log('TABLE CREATED');
app.listen(5000);
})
.catch(err=>console.log(err));

