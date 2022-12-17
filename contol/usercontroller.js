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
          return res.json({success: false, message:"Email already exists. Please login with the email credentials"})  
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