const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
var cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

//models
const User = require('./model/user');
const Expenses = require('./model/Expenses');
const Order = require ('./model/orders');
const Uuid = require('./model/uuid-table');
const Report = require('./model/reports');

//routes
const expenseroute = require('./routes/expenseroute');
const userroute= require('./routes/user-route');
const purchaseroute = require('./routes/purchase-route');
const premiumroute = require('./routes/premium-route');
const passwordroute = require('./routes/password')


const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags: 'a'})


const express = require('express');
// const sequelize = require('./util/database');

const app = express();


app.use(express.static(path.join(__dirname,'Frontend')));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// console.log(helmet.contentSecurityPolicy.getDefaultDirectives())
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'https://unpkg.com/axios/dist/axios.min.js'","'https://checkout.razorpay.com/v1/checkout.js'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/expenses', expenseroute);
// app.get('/expenselist', expenseroute);
// app.post('/expenses', expenseroute);
// app.post('/delete-expense', expenseroute);
app.use('/user', userroute);
// app.post('/user/signup', userroute);
// app.post('/user/login', userroute);

app.use('/purchase', purchaseroute);
// app.get('/purchase/premiummembership', purchaseroute)
// app.post('/purchase/updatetransactionstatus', purchaseroute)
app.use('/premium', premiumroute)
app.use('/password', passwordroute)




app.use((req,res)=>{
    res.sendFile(path.join(__dirname, "Frontend/home.html"))
})

User.hasMany(Expenses);
Expenses.belongsTo(User);

Order.belongsTo(User);
User.hasMany(Order);

User.hasMany(Uuid);
Uuid.belongsTo(User);

Report.belongsTo(User);
User.hasMany(Report);

sequelize.sync()
.then(result=>{

app.listen(5000);
})
.catch(err=>console.log(err));

