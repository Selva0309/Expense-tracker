const logincontainer = document.querySelector(".login-container");
const signupcontainer = document.querySelector(".signup-container");

function signup(){

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(name, email, password);

    axios.post('http://localhost:5000/user/signup',{name: name, email:email, password:password})
    .then((response)=>{
        if(response.status==201){
        message = response.data.message;
        notifyUser(message);
        showloginpage();
        } else {
            notifyUser(err);
        }
    }).catch(err => {
        if(err.response.status == 400){
            notifyUser(err.response.data.message);
            showloginpage();
        }
})
};


function notifyUser(message) {
    const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
            notification.innerHTML=`
            <h4>${message} </h4>
            `;
            container.appendChild(notification);
            container.style = 'display: block;'
            setTimeout(()=>{
                notification.remove();
                container.style = 'display: none;'
            },2000)
}

function showloginpage(){
    signupcontainer.style = 'display: none';
    logincontainer.style = 'display: flex';
    
}

function showsignuppage(){
    signupcontainer.style = 'display: flex';
    logincontainer.style = 'display: none';
    
}

function login(){

    
    const email = document.getElementById('useremail').value;
    const password = document.getElementById('userpassword').value;
    console.log(email, password);

    axios.post('http://localhost:5000/user/login',{email:email, password:password})
    .then((response) =>{
              
        message = response.data.message;
        success = response.data.success;
        token = response.data.token;
        premium = response.data.premium;
        // Status = response.status;
        // console.log(Status, message);
        if(success==true){
            notifyUser(message);
            localStorage.setItem('token', token);
            localStorage.setItem('premium', premium);
            window.location.assign('/Expenses.html');           

        } 
        
        // showloginpage();
    }). catch(err => {
        if(err.response.status == 400){
            notifyUser(err.response.data.message);
        } else if (err.response.status == 404){
            notifyUser(err.response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 4000)
        }
    })
}
document.querySelector('.forgot-btn').addEventListener('click', forgotpasswordpage => {
    document.querySelector('.login-container').style = 'display: none;';
    document.querySelector('.forgetpassword-container').style = 'display: block;'
} )