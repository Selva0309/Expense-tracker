const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');
const Uuid = require('../model/uuid-table');
const User = require('../model/user');
const bcrypt = require('bcrypt');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.forgotpassword = (req, res,next) =>{
    const email = req.body.emailID;
    const uuid = req.body.uuid;
    console.log(email,uuid);
let msg = {
  to: email, // Change to your recipient
  from:'selva3010kkl@gmail.com', // Change to your verified sender
  subject: 'Forgot password link',
  text: 'and easy to do anywhere, even with Node.js',
  html: `<a href="http://18.181.82.118/password/resetpassword/${uuid}">Reset password</a>`,
}


sgMail
  .send(msg)
  .then((response) => {
    console.log(msg)
    console.log(response[0].statusCode)
    // console.log(response[0].headers)
    res.status(200).json({success: true, message: "Email sent successfully"})
  })
  .catch((error) => {
    console.error(error)
  })

}

exports.resetpassword = (req,res,next)=>{
  const id = req.params.id;
//   console.log(id);
  Uuid.findOne({where: {id: id}}).then(uuid=>{
    if(uuid){
      uuid.update({ isactive: false});
      res.status(200).send(`<html>
                              <script>
                                  function formsubmitted(e){
                                      e.preventDefault();
                                      console.log('called')
                                  }
                              </script>
                              <style>
                              @import url("http://fonts.googleapis.com/css2?family=Muli&display=swap");
                              @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap");
                              @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
                              *{
                                  box-sizing: border-box;
                                  font-family: Muli, 'Calibri';
                              }
                              
                              body{
                                  background: rgb(2,0,36);
                              background: linear-gradient(54deg, rgba(2,0,36,1) 0%, rgba(77,61,128,1) 0%, rgba(28,117,184,1) 41%, rgba(0,255,145,1) 98%) no-repeat;
                                  object-fit: contain;
                                  height: 100vh;
                                  
                              }
                              
                              .header-nav{
                                  width: 100%;
                                  height: 60px;
                                  display: flex;
                                  flex-direction: row;
                                  justify-content: left;
                                  align-items: center;
                              }
                              
                              .header-nav h1{
                                  font-size: 25px;
                                  color: rgba(0,255,145,1);
                                  margin-left: 10px;
                                  
                                  letter-spacing: 2px;
                                  font-family: Poppins;
                              }
                              
                              .form-control {
                                  height: auto;
                                  width: 35%;
                                  justify-content: space-around;
                                  margin: 10% auto;
                                  padding: 2%;
                                  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.5);
                                  background-color: rgba(0, 0, 0, 0.5);
                                  border-radius: 5px;
                              }
                              
                              
                              .form-control div{
                                  display: flex;
                                  flex-direction: column;
                                  justify-content: space-evenly;
                                  margin: 2%;
                                  padding: 2%;
                              }
                              
                              .form-control input{
                                  margin-top: 10px;
                                  height: 35px;
                                  width: 60%;
                                  border: none;
                                  border-radius: 2px;
                                  border-bottom: 2px solid rgba(0,255,145,1);
                                  background-color: transparent;
                                  color: #FEBE10;
                                  font-family: inherit;
                              }
                              
                              .form-control label{
                                  font-size: 16px;
                                  color: #FEBE10;
                                  margin-right: 1%;
                              }
                              
                              .btn {
                                  text-align: center;
                                  width: 50%;
                                  height: 2.5rem;
                                  margin: 5% 25%;
                                  justify-content: center;
                                  align-items: center;
                                  display : inline-block;
                                  background-color: rgb(29, 207, 130);
                                  border: none;
                                  border-radius: 5px;
                                  font-weight: bold;
                                  font-size: 16px;
                                  cursor: pointer;
                                  transition-duration: 0.4s;
                                  
                              }
                              
                              .btn:active, .btn:hover {
                                  background-color: #922065;
                                  color: #FEBE10;
                                  border: 2px solid #F25922;
                                  background-position: 99% 50%;
                                  box-shadow: 10px 10px 14px 1px rgb(0 0 0 / 20%);
                              }

                              </style>
                              <body>
                                <section class="header-nav">
                                    <h1>EXPENSE TRACKER</h1>
                                </section>

                                <form class='form-control' action="/password/updatepassword/${id}" method="get">
                                  <label for="newpassword">Enter New password</label>
                                  <input name="newpassword" type="password" required></input>
                                  <button class='btn'>Reset password</button>
                              </form>
                              </body>
                          </html>`
                          )
      res.end()

  }
})
    }

exports.updatepassword = (req, res) => {

      try {
          const { newpassword } = req.query;
          const { resetpasswordid } = req.params;
          Uuid.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
              User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                  // console.log('userDetails', user)
                  if(user) {
                      //encrypt the password
  
                      const saltRounds = 10;
                      bcrypt.genSalt(saltRounds, function(err, salt) {
                          if(err){
                              console.log(err);
                              throw new Error(err);
                          }
                          bcrypt.hash(newpassword, salt, function(err, hash) {
                              // Store hash in your password DB.
                              if(err){
                                  console.log(err);
                                  throw new Error(err);
                              }
                              user.update({ password: hash }).then(() => {
                                res.status(200).json({message: "Password Updated successfully"})
                                // res.redirect('/');
                              })
                          });
                      });
              } else{
                  return res.status(404).json({ error: 'No user Exists', success: false})
              }
              })
          })
      } catch(error){
          return res.status(403).json({ error, success: false } )
      }
  
  }
  