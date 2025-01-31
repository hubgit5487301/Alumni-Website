import { uploaddataonevent as post_login } from "./util.js";
const urlParams = new URLSearchParams(window.location.search);

if(urlParams.has('alert')) {
  const message = urlParams.get('alert');
  if(message === 'not-logged-in') {
    alert('You need to login first!');
    window.location.href = '/login';
  }
  else if(message === 'account-verified'){
    alert('Account Verified');
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

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  form.querySelectorAll('input').forEach(input => {
    input.value =  input.value.replace(/\s+/g, ''); 
  })
  const form_data = new FormData(form);
  const login_data = Object.fromEntries(form_data.entries());
  login_data.userid = login_data.userid.toUpperCase();
  const response = await post_login('login', login_data);
  if(response.message === 'Login successful') window.location.href = response.redirectUrl;
})