import { API_BASE_URL } from "./config.js";
import { passwordMatchcheck, inputCheck,isValidUserid, isValidEmail} from '/script/util.js';
  
  document.querySelector('.js-submit-button').addEventListener('click', (event) => {
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
      alert('Userid is not valid enter your college roll no of format 21cse__');
      return;
    }

    if(!isValidEmail()) {
      alert('Invalid Email');
      return;
    }

    let check = passwordMatchcheck(password, renterpassword, '.js-password-recheck');
    if(check === false)
    {
      return;
    }
    const storedAlumni= ({
      personname: inputname,
      userid: userid.trim(),
      email: email.trim(),
      getpassword: password.trim(),
    });

    fetch(`${API_BASE_URL}/submit-alumni`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storedAlumni),
    })
    .then((response) => {
      if(!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || 'error submiting data');
      });
    }
    return response.json()
  })
    .then((data) => {
      alert('Check Your email for verification link');
      window.location.href = '/login';})
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    });
});


