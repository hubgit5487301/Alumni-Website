import { inputCheck, isValidEmail, uploaddataonevent as post_message } from "/script/util.js"; 

document.querySelector('.js-submit-message-button').addEventListener('click', async (event) => {
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
  const response = await post_message('send-message', message);
  if(response.message === 'Message Sent') {
    alert(response.message);
    document.querySelector('form').reset();
  }
})