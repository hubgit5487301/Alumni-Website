const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');

if(userid){
fetch(`http://localhost:8000/protected/users/${userid}`)
.then( response => {
  if(!response.ok)
  {
    throw new Error('response was not ok');
  }
  return response.json();
})
.then(user => {
const profilehtml = `<div class="first-view">
          <img class="profile-pic" src="${user.personimage}">
          <p class="name" id="name">${user.personname}</p>
          <div class="basic-data">
            <p>Batch: </p>
            <p>${user.details.batch}</p>
            <p>|</p>
            <p class="branchname">${user.details.branch}</p>
          </div>
        </div>
        <div class="useral-details">
          <h1>About Me</h1>
          <p class="about-me">${user.details.aboutme}</p>
          <h1>Education</h1>
          <p class="education">${user.details.education}</p>
          <h1>Current Role</h1>
          <p class="current-role">${user.details.currentrole}</p>
          <h1>Work Experience</h1>
          <p class="experience">${user.details.experience}</p>
          <h1>Contact Information</h1>
          <p class="contact-information">${user.details.contactinfo}</p>
  `;          
  document.querySelector('.js-profile-page').innerHTML = profilehtml;
})
.catch(error => console.error('error while fetching user data:',error));
}
else {
  console.error('no userid given');
}