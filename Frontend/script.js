function signup(){

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(name, email, password);

    axios.post('http://localhost:5000/user/signup',{name: name, email:email, password:password})
    .then((response)=>{
        message = response.data.message;
        notifyUser(message);
    })
}


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
            },2500)
}