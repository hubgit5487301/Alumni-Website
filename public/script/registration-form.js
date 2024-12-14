import { API_BASE_URL } from "./config.js";
import { changefieldcolor,changefieldcolordefault, passwordMatchcheck, inputCheck,isValidUserid, isValidEmail, upload as profilepicupload, setBranchValue, usertype_and_batchSet} from '/script/util.js';

const imagesallowed = ['image/jpeg', 'image/png'];
    
let personimage = null;
profilepicupload('.js-pic-input',imagesallowed,true,'.js-pic-input',(file64) =>{
  personimage = file64;
});

let batch = '';
let branch = '';
let usertype = '';


  document.querySelector('.js-userid').addEventListener('input', () => { 
     branch = setBranchValue('.js-userid');
     const {user_type, year} = usertype_and_batchSet();
     usertype = user_type;
     batch = year;
  });
  document.querySelector('.js-userid').addEventListener('input', () => {
    
  })
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
      changefieldcolor(document.querySelector('.js-userid'));
      alert('Userid is not valid enter your college roll no of format 21cse__');
      return;
    }

    if(!isValidEmail(email)) {
      changefieldcolor(document.querySelector('.js-email'));
      alert('Enter a valid email');
      return;
    }


    let check = passwordMatchcheck(password, renterpassword, '.js-password-recheck');
    if(check === false)
    {
      return;
    }
    else if (check === true)
    {
      changefieldcolordefault(document.querySelector('.js-password-recheck'));
    }(branch)
    const storedAlumni= ({
      personname: inputname,
      userid: userid,
      usertype: usertype,
      email: email,
      getpassword: password,
      personimage: personimage,
      details:{
        batch:batch,
        branch:branch,
       }
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
      alert('Form submitted successfully!');
      window.location.href = '/login';})
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    });
});


