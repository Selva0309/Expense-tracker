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
  