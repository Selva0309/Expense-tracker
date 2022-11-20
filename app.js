const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const Expenses = require('./model/Data');
const expenseroute = require('./routes/expenseroute');


const express = require('express');
// const sequelize = require('./util/database');

const app = express();
app.use(express.static(path.join(__dirname,'css')));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/expenselist', expenseroute);
app.post('/expenses', expenseroute);
app.post('/edit-expense', expenseroute);
app.post('/update-expense', expenseroute);
app.post('/delete-expense', expenseroute);



app.use('/', expenseroute);


sequelize.sync()
.then(result=>{
console.log('TABLE CREATED');
app.listen(5000);
})
.catch(err=>console.log(err));

