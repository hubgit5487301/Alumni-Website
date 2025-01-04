import { API_BASE_URL } from "./config.js";
import { inputCheck, isValidEmail } from "/script/util.js"; 


document.querySelector('.js-submit-message-button').addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.querySelector('.js-name');
  const email = document.querySelector('.js-email');
  const message_input = document.querySelector('.js-message');
  
  const fields= [
    {value: name.value, selector: '.js-name'},
    {value: email.value, selector: '.js-email'},
    {value: message_input.value, selector: '.js-message'}
  ]
  
  const isInvalid = inputCheck(fields);
  if(isInvalid) {
    alert('Please fill in all fields marked.');
    return;
  }

  if(!isValidEmail(email.value)) {
    alert('Enter a valid email.');
    return;
  }
  const message = ({
    name: name.value,
    email: email.value,
    message: message_input.value
  })
  fetch(`${API_BASE_URL}/send-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error(error.message||'error submitting data');
    }
    return response.json()
  })
  .then(data => {
    if(data.message === 'Message Sent') {
      alert(data.message);
      document.querySelector('form').reset();
    }
  })
  .catch((err) => {
      console.error(err.message);
      alert(err.message);
 })

})





