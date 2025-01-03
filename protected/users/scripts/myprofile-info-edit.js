import {getdataonevent as getuserdetails, updatedataonevent as updatedetails} from "../../protected-scripts/util.js"

const data = await getuserdetails(`user_info`);

const aboutme = document.querySelector('#aboutme');
const education = document.querySelector('#education');
const currentrole = document.querySelector('#currentrole');
const experience = document.querySelector('#experience');
const contactinfo = document.querySelector('#contactinfo');

function add_data () {
  aboutme.value = data.aboutme;
  education.value = data.education;
  currentrole.value = data.currentrole;
  experience.value = data.experience;
  contactinfo.value = data.contactinfo;
}
add_data();

document.querySelector('.submit-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const form = document.querySelector('form');
  const formdata = new FormData(form);
  const form_data = Object.fromEntries(formdata);
  const fields = [aboutme, education, currentrole, experience, contactinfo];
  let change = false;
  for (let field of fields) {
    if (field.value !== data[field.id]) {
      change = true;
      break;
    }
  }
  if(change) {
    const response = await updatedetails(`update_details`, form_data);
    if(response.message === 'New details added successfully') {
      alert('New details added successfully');
      window.location.href = '/protected/my-profile-page';
    }
  }
  else {
    alert('Please input new details');
  }
});