import { API_BASE_URL } from "./config.js";
import {isValidUserid} from "./util.js"


const submitButton = document.querySelector('.js-submit-button');

submitButton.addEventListener('click', (e) => {
  submitButton.disabled = true;
  e.preventDefault();                    
  const userid_input = document.querySelector('.js-user-id-box');
  const userid = userid_input.value.toUpperCase();

  if(!isValidUserid(userid)) {
    alert('Userid is not valid enter your college roll no of format 21CSE__');
    submitButton.disabled = false;
    return;
  }
  
  submitButton.innerText = 'Processing...';
  const data = ({userid});
  fetch(`${API_BASE_URL}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok')
    }
    return response.json();
  })
  .then(data => {
    if(data.message === 'OTP sent') {
      submitButton.innerText = 'Redirecting...';  
      alert('Please check your regsitered email for OTP');
      window.location.href = `/verify-otp?userid=${userid}`;
    }
    else if(data.message === 'User not found') {
      alert('User does not exist');
      submitButton.innerText = 'Submit';
      userid_input.value = '';
    }
    else {
      window.location.reload();
    }
  })
  .catch(err => {
    console.log(err);
  })
})