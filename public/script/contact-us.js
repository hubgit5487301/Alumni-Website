import { API_BASE_URL } from "./config.js";
import { inputCheck, isValidEmail } from "/script/util.js"; 

document.querySelector('.js-submit-message-button').addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.querySelector('.js-name').value;
  const email = document.querySelector('.js-email').value.trim();
  const message_input = document.querySelector('.js-message').value;
  
  const fields= [
    {value: name, selector: '.js-name'},
    {value: email, selector: '.js-email'},
    {value: message_input, selector: '.js-message'}
  ]
  
  const isInvalid = inputCheck(fields);
  if(isInvalid) {
    alert('Please fill in all fields marked.');
    return;
  }

  if(!isValidEmail(email)) {
    alert('Enter a valid email.');
    return;
  }

  const message = ({
    name: name,
    email: email,
    message: message_input
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
    alert(data.message);
  })
  .catch((err) => {
      console.error(err.message);
      alert(err.message);
 })

})





