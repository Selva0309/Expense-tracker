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
  html: `<a href="http://localhost:5000/password/resetpassword/${uuid}">Reset password</a>`,
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
  console.log(id);
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
                              background: linear-gradient(54deg, rgba(2,0,36,1) 0%, rgba(62,32,154,1) 0%, rgba(39,9,121,1) 47%, rgba(0,255,145,1) 98%) no-repeat;
                                  object-fit: contain;
                                  height: 100vh;                                
                              }
                              .form-control{
                                width: 30%;
                                height: 30%;
                                margin: 10% auto;
                                
                                display: flex;
                                flex-direction: column;
                                justify-content: space-around;
                                background-color: rgba(0, 0, 0, 0.5);
                                border-radius: 5px;
                                box-shadow: 0 5px 8px rgba(0, 0, 0, 0.5);
                                }
                                .form-control input{
                                    margin: 15px auto;
                                    width: 95%;
                                    height: 50px;
                                    border: none;
                                    border-bottom: 2px solid rgba(0,255,145,1);
                                    background-color: inherit;
                                    color: rgba(0,255,145,1);
                                    font-family: inherit;
                                }
                                
                                .form-control label{
                                    margin: 5% auto;
                                    align-items: center;
                                    font-size: 16px;
                                    color: rgb(29, 207, 130)
                                }
                                .header-nav h1{
                                    font-size: 25px;
                                    color: rgba(0,255,145,1);
                                    margin-top: 2%;
                                    margin-left: 10px;
                                    letter-spacing: 2px;
                                    font-family: Poppins;
                                }
                                .btn {
                                    text-align: center;
                                    width: 50%;
                                    height: 2.5rem;
                                    margin: 10% 25%;
                                    justify-content: center;
                                    align-items: center;
                                    position: relative;
                                    bottom: 10%;
                                    display : inline-block;
                                    background-color: rgb(29, 207, 130);
                                    border: none;
                                    border-radius: 5px;
                                    font-weight: bold;
                                    font-size: 16px;
                                    cursor: pointer;
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
  