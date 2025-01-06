import {uploaddataonevent as post_data} from '/script/util.js';

const form = document.querySelector('form');
form.addEventListener('submit',async (e) => {
  e.preventDefault();
  document.querySelectorAll('input').forEach(element => {
    element.value = element.value.replace(/\s+/g, '');
  })
  const form_data = new FormData(form);
  const new_user = Object.fromEntries(form_data.entries());
  new_user.userid = new_user.userid.toUpperCase();
  if(new_user.getpassword !== new_user.repassword) {
    document.querySelector('#renterpassword').style.borderColor = 'red';
    alert('Passwords do not match');
    return;
  }
  delete new_user.repassword;
  const response = await post_data('submit_user',new_user);
    if(response.message === 'Data submitted') {
      alert('Check Your email for verification link');  
          window.location.href = '/login';
    }
})