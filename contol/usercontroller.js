const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.adduser=(req,res,next)=>{
    // console.log(req.body,req.params, req.data);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findAll({where: {email: email}})
    .then(users=>{
        let user;
        user= users[0];
    
        if (user){
          return res.status(400).json({success: false, message:"User already exists. Please login with the email credentials"})  
        } else{
            const saltrounds = 10;
            bcrypt.hash(password,saltrounds, async (err, hash)=>{
                await User.create({
                    name: name,
                    email: email,
                    password: hash
                })
                res.status(201).json({success: true, message:"Signed up successfully"})
            })

}
}).catch(err=>res.status(500).json(err))
};

exports.loginuser=(req,res,next)=>{
    // console.log(req.body,req.params, req.data);
    const email = req.body.email;
    const password = req.body.password;
    User.findAll({where: {email: email}})
    .then(users=>{
        let user;
        user= users[0];
        
        // console.log(user.password);
    
        if (user){
            bcrypt.compare(password, user.password, (err,result)=>{
                console.log(result);
                if (err){
                    throw new Error('Something went wrong');
                }
                if(result === true){
                    return res.status(201).json({success: true, message:"Logged in successfully", token: accesstoken(user.id,user.name)})
                    // res.redirect('/Expenses.html');
                }
                else {
                    return res.status(400).json({success: false, message:"Incorrect password!!"})
                }
            })
                
        }else{
           return res.status(404).json({success: false, message:"User does not exists. Please signup with details"})
        }
})
        
};

function accesstoken(id,name){
    let token = jwt.sign({userId: id, name:name},process.env.SIGN_KEY)
    console.log(token);
    return token;
}