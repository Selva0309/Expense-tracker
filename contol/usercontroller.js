const User = require('../model/user');

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
          return res.json({success: false, message:"User already exists. Please login with the email credentials"})  
        } else{
            User.create({
                name: name,
                email: email,
                password: password
            }).then(result=>{
                console.log("User created");
                res.status(200).json({success: true, message:"Signed up successfully"})
            })
        }

})
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
            if(user.password===password){
                return res.json({success: true, message:"Logged in successfully"})
            } else {
                return res.json({success: true, message:"Incorrect password!!"})
            }
            
        } else{
           return res.json({success: false, message:"User does not exists. Please signup with details"})
            }
})
        
};