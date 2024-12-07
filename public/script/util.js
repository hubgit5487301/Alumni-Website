import { API_BASE_URL } from "./config.js";
export function changefieldcolor(input) {
  input.classList.add('input-error');
  input.classList.remove('input-default');
}

export function changefieldcolordefault(input) {
  input.classList.remove('input-error');
  input.classList.add('input-default');
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function inputCheck(fields) {
  let inputcheck = false;

  fields.forEach(({ value, selector }) => {
    const field = document.querySelector(selector);
    if (!value) {
      changefieldcolor(field);
      inputcheck = true;
    } else {
      changefieldcolordefault(field);
    }
  });

  return inputcheck;
}


export function isValidUserid(userid) {
  const useridregex = /^(98|99|[0-9]{2})(CSE|ME|CE|EE|ECE)(0[1-9]|[1-9][0-9])$/;
  return useridregex.test(userid);
}

/*export function upload(input, callback) {
  document.querySelector(input).addEventListener('input', () => {

    const personimage = document.querySelector(input).files[0];
    const imagesallowed = ['image/jpeg', 'image/png'];
    if(!imagesallowed.includes(personimage.type)) {
        alert('Invalid file type');
        return;
    }
    else {
      callback(personimage);
    }
  })
}*/


export function upload (input,allowed,value,name, callback) {
  document.querySelector(input).addEventListener('change', (event) => {
    const filename = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
    const file =event.target.files[0];
    if (file) {
      
      if (!allowed.includes(file.type)) {
        alert('invalid file ');
        return;
      }
    }
    if(value)
    {
      document.querySelector(name).innerHTML = file.name;
    }

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const file64 = reader.result;
        if (callback) callback(file64);
      }
    }
  })}

export function formatEventDate(eventdate) {
  const date = new Date(eventdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}, ${hours}:${minutes}`;
}

export function setBranchValue (textinput, selectinput) {
  const branch = document.querySelector(textinput).value;
  const selectbranch = document.querySelector(selectinput);
  const match = branch.match((/\d([A-Z]|[a-z]+)\d/));

  if (match && match[1]) {
    const idbranch = match[1];
    if(idbranch === 'CSE' || idbranch === 'cse') {
      selectbranch.value = 'CSE';
    }
    else if ( idbranch === 'ME' || idbranch === 'me') {
      selectbranch.value = 'ME';
    }
    else if ( idbranch === 'CE' || idbranch === 'ce') {
      selectbranch.value = 'CE';
    }
    else if ( idbranch === 'EE' || idbranch === 'ee') {
      selectbranch.value = 'EE';
    }
    else if ( idbranch === 'ECE' || idbranch === 'ece') {
      selectbranch.value = 'ECE';
    }
    selectbranch.disabled = true;
  }
}


export function usertype_and_batchSet () {
  const userid = document.querySelector('.js-userid').value;
  const usertype = document.querySelector('.js-user-type');
  const test = document.querySelector('.js-batch');
  let admissionyear = parseInt(userid.substring(0, 2));
  const currentyear = parseInt((new Date().getFullYear()).toString().slice(-2));
  if(admissionyear) {
  if(currentyear >= admissionyear+4) {
    usertype.value = 'alumni';
    usertype.disabled = true;
  }
  else {
    usertype.value = 'student';
    usertype.disabled = true;
  }
  admissionyear = admissionyear + 2000;
  test.value = (admissionyear).toString();
  test.disabled = true;
  }
  else { 
    usertype.disabled = false;
    test.disabled = false;
  }
}








/*export function darkMode () {
  document.querySelector('.js-dark-mode-button').addEventListener('click', () => {
  const generaldashboard = document.querySelector('.general-dashboard');
  const bottombox = document.querySelector('.bottom-box');
  const navbar = document.querySelector('.js-top-box');
  const bottombar = document.querySelector('.js-bottom');
  const inputboxes = document.querySelectorAll('input');
  const currentBgColor = getComputedStyle(navbar).backgroundColor;

    if(currentBgColor === 'rgb(255, 255, 255)') {
      generaldashboard.style.color = 'rgb(255, 255, 255)';
      navbar.style.backgroundColor = 'black';
      bottombar.style.backgroundColor = 'black';
      bottombox.style.backgroundColor = 'black';
      document.querySelectorAll('a').forEach(link => {link.style.color = 'rgb(255, 255, 255)';});
      inputboxes.forEach(input => { input.style.backgroundColor = 'rgb(255, 255, 255)';})
      //console.log('a' + bottombox.style.backgroundColor);
     }
     else {
      generaldashboard.style.color = 'black';
      bottombox.style.backgroundColor = 'rgb(255, 255, 255)';
      navbar.style.backgroundColor = 'rgb(255, 255, 255)';
      bottombar.style.backgroundColor = 'rgb(255, 255, 255)';
      document.querySelectorAll('a').forEach(link => {link.style.color = 'black';});
      //console.log('b' + bottombox.style.backgroundColor);
    }
  })

}*/

export async function getdataonevent (address) {
  try{
    const response = await fetch(`http://${API_BASE_URL}:8000/protected/${address}`);
    if(!response.ok) {
      throw new Error('response not ok');
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    throw err;
  }    
}

export function passwordMatchcheck (password, renterpassword, input, input2){
  if (password != renterpassword)
  { changefieldcolor(document.querySelector(input));
    changefieldcolor(document.querySelector(input2));
    alert("Passwords do not match!");
    return false;
  }
  return true;
}

export function yearSelect (input) {
  const startYear = 1998;
  const endYear = (new Date().getFullYear()) + 4;
  const yearSelect = document.querySelector(input);
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
};
