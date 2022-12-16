const User = require('../model/user');

exports.adduser=(req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name,email,password);
    User.create({
        name: name,
        email: email,
        password: password
    }).then(result=>{
        console.log("User created");
        res.status(200).json({success: true, message:"Signed up successfully"})
    })
}