import { API_BASE_URL } from "./config.js";
import { uploaddataonevent as post_login } from "./util.js";
const urlParams = new URLSearchParams(window.location.search);

if(urlParams.has('alert')) {
  const message = urlParams.get('alert');
  if(message === 'not-logged-in') {
    alert('You need to login first!');
    window.location.href = '/login';
  }
  else if(message === 'account-verified'){
    alert('Account Verfied');
  }
  else if(message === 'User-not-found'){
    alert('Invalid Token');
  }
  else if(message === 'Link-expired'){
    alert('Link expired. New link sent to registered email');
  }
  else if(message === 'Link-not-found') {
    alert('Link not found')
  }
}

document.querySelector('.js-login-button').addEventListener('click', async (event) => {
  event.preventDefault();
  const inputuserid = (document.querySelector('.js-userid-box').value).trim();
  const password = (document.querySelector('.js-password-box').value).trim();
  const userid = inputuserid.toUpperCase();
  const logindata = {
    userid: userid,
    password: password,
  }
  try {
  const response = await post_login('login', logindata);
  if(response.message === 'Login successful') {
    window.location.href = response.redirectUrl;
  }
  else {
    alert(response.error);
  }
  }
  catch(err) {
    console.log(err.message);
  }
})