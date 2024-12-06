import { changefieldcolor,changefieldcolordefault, passwordMatchcheck, inputCheck,isValidUserid, isValidEmail, upload as profilepicupload, setBranchValue, usertypeSet} from '/script/util.js';

const imagesallowed = ['image/jpeg', 'image/png'];
    
let personimage = null;
profilepicupload('.js-pic-input',imagesallowed,true,'.js-pic-input',(file64) =>{
  personimage = file64;
});


function formInput() {
  document.querySelector('.js-userid').addEventListener('input', () => { 
    const selectbranch = document.querySelector('.js-branch');
    selectbranch.disabled = false;
    setBranchValue('.js-userid', '.js-branch');
  });
  document.querySelector('.js-userid').addEventListener('input', () => {
    usertypeSet();
  })
  document.querySelector('.js-submit-button').addEventListener('click', (event) => {
    event.preventDefault();
    const inputname = document.querySelector('.js-name').value;
    const userid = document.querySelector('.js-userid').value.toUpperCase();
    const batch = document.querySelector('.js-batch').value;
    const branch = document.querySelector('.js-branch').value;
    const email = document.querySelector('.js-email').value;
    const password = document.querySelector('.js-password').value;
    const renterpassword = document.querySelector('.js-password-recheck').value;
    const aboutme = document.querySelector('.js-about-me').value;
    const education = document.querySelector('.js-education').value;
    const currentrole = document.querySelector('.js-current-role').value;
    const experience = document.querySelector('.js-experience').value;
    const contactinfo = document.querySelector('.js-contact-info').value;
    const usertype = document.querySelector('.js-user-type').value;
    //const userprivacy = document.querySelector('.js-privacy').value;
    
    const fields = [
      { value: inputname, selector: '.js-name' },
      { value: userid, selector: '.js-userid' },
      { value: batch, selector: '.js-batch' },
      { value: branch, selector: '.js-branch' },
      { value: email, selector: '.js-email' },
      { value: password, selector: '.js-password' },
      { value: renterpassword, selector: '.js-password-recheck' },
      { value: usertype, selector: '.js-user-type'},
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
    }

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
        aboutme:aboutme,
        education: education,
        currentrole: currentrole,
        experience: experience,
        contactinfo: contactinfo,}
    });

    fetch('https://localhost:8000/submit-alumni',{
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
      console.log(data);
      alert('Form submitted successfully!');
      window.location.href = '/login';})
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    });
});}



function yearSelect () {
  const startYear = 2002;
  const endYear = (new Date().getFullYear()) + 4;
  const yearSelect = document.querySelector('.js-batch');
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
};



yearSelect();
formInput();


