import {getdataonevent as getuserdetails, updatedataonevent as updatedetails} from "./util.js"

const data = await getuserdetails(`user_info`);

const aboutme = document.querySelector('.js-about-me');
const education = document.querySelector('.js-education');
const currentrole = document.querySelector('.js-current-role');
const experience = document.querySelector('.js-experience');
const contactinfo = document.querySelector('.js-contact-info');


async function adddata () {
  aboutme.value = data.aboutme;
  education.value = data.education;
  currentrole.value = data.currentrole;
  experience.value = data.experience;
  contactinfo.value = data.contactinfo;
}
adddata();


const submitButton = document.querySelector('.js-submit-button');

submitButton.addEventListener('click', async (e) => {
  e.preventDefault();
  if( 
    aboutme.value !== data.aboutme &&
    education.value !== data.education &&
    currentrole.value !== data.currentrole &&
    experience.value !== data.experience &&
    contactinfo.value !== data.contactinfo) {
    const newdetails = ({
      aboutme: aboutme.value,
      education: education.value,
      currentrole: currentrole.value,
      experience: experience.value,
      contactinfo: contactinfo.value
    });

    const data = await updatedetails(`update_details`, newdetails);
    if(data.message === 'New details added successfully') {
      alert('New details added successfully');
      window.location.reload();
    }
    else if(data.message === 'No changes made') {
      alert(data.message);
    }
  }
  else {
    alert('Please input new details')
  }
})

