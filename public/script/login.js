import { API_BASE_URL } from "./config.js";
const urlParams = new URLSearchParams(window.location.search);


if(urlParams.has('alert')) {
  const amessage = urlParams.get('alert');
  if(amessage === 'not-logged-in') {
    alert('You need to login first!');
    window.location.href = '/login';
  }
}

document.querySelector('.js-login-button').addEventListener('click', (event) => {
  event.preventDefault();
  const inputuserid = document.querySelector('.js-userid-box').value;
  const password = document.querySelector('.js-password-box').value;
  const userid = inputuserid.toUpperCase();
  const logindata = {
    userid: userid,
    password: password,
  }
  
fetch(`http://${API_BASE_URL}/login`, {
  method: 'POST',
  headers:{
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(logindata),

})
.then((response) => {
  

  if(!response.ok) {
    return response.json().then((data) => {
      throw new Error(data.message);
    });
  }
  return response.json();
  })
.then((data) => {
  alert(data.message);
  window.location.href = '/dashboard';
  })
.catch((error) => {
  alert(error.message);
  console.log('Error',error);
})

})