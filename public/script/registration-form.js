import { passwordMatchcheck, inputCheck,isValidUserid, isValidEmail, uploaddataonevent as post_data} from '/script/util.js';

document.querySelector('.js-submit-button').addEventListener('click', async (event) => {
  event.preventDefault();
  const inputname = document.querySelector('.js-name').value;
  const userid = document.querySelector('.js-userid').value.toUpperCase();
  const email = document.querySelector('.js-email').value;
  const password = document.querySelector('.js-password').value;
  const renterpassword = document.querySelector('.js-password-recheck').value;

  //const userprivacy = document.querySelector('.js-privacy').value;

  const fields = [
    { value: inputname, selector: '.js-name' },
    { value: userid, selector: '.js-userid' },
    { value: email, selector: '.js-email' },
    { value: password, selector: '.js-password' },
    { value: renterpassword, selector: '.js-password-recheck' },
    
    //{ value: userprivacy, selector: '.js-privacy'}
  ];
  let inputcheck = inputCheck(fields);
  if (inputcheck === true)
    {
      alert('Enter details correctly');
      return;
    }
  
  if(!isValidUserid(userid)) {
    alert('Userid is not valid enter your college roll no of format 21CSE01');
    return;
  }

  if(!isValidEmail(email)) {
    alert('Invalid Email');
    return;
  }

  let check = passwordMatchcheck(password, renterpassword);
  if(check === false)
  {
    return;
  }
  const newUser= ({
    personname: inputname,
    userid: userid.trim(),
    email: email.trim(),
    getpassword: password.trim(),
  });
  const response = await post_data('submit_user',newUser);
  if(response.message === 'Data submitted') {
    alert('Check Your email for verification link');
        window.location.href = '/login';
  }
  else {
    alert(response.message);
  }});