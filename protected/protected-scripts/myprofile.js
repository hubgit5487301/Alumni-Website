import { API_BASE_URL } from "./config.js";

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');


fetch(`http://${API_BASE_URL}:8000/protected/my-profile`)
.then( response => {
  if(!response.ok)
  {
    throw new Error('response was not ok');
  }
  return response.json();
})
.then(user => {
  const userid = user.userid;
  const profilehtml = `
      <div class="user-page js-user-page">
        <div class="first-view">
          <img class="user-pic" src="${user.personimage}">
          <div class="activity">
            <button class="activity-button js-button-1">My Applications</button>
            <button class="activity-button js-button-2">My Posts</button>
          </div>
          <div class="basic-data">
            <p class="name">${user.personname}</p>
            <div class="basic-data-details">
              <p>Batch: ${user.details.batch}</p>
              <p>Branch: ${user.details.branch}</p>
            </div>
          </div>
        </div>
        <div class="user-requirement">
          <div class="req-text">
              <h2>About Me:</h2> 
              <p>${user.details.aboutme}</p>
          </div>
            <div class="req-text">
              <h2>Education:</h2>
              <p>${user.details.education}</p>
            </div>
            <div class="req-text">
              <h2>Current Role:</h2>
              <p>${user.details.currentrole}</p>
            </div>
            <div class="req-text">
              <h2>Work Experience:</h2>
              <p>${user.details.experience}</p>
            </div>
            <div class="req-text">
              <h2>Contact Info:</h2>
              <p>${user.details.contactinfo}</p>
            </div>
        </div>
      </div>
  `;          
  document.querySelector('.js-profile-page').innerHTML = profilehtml;


  const appButton = document.querySelector('.js-button-1');
  appButton.addEventListener('click', () => {
    window.location.href = `myprofile-appli/?userid=${userid}`;
  })

  const postButton = document.querySelector('.js-button-2');
  if(user.usertype === 'alumni' || user.usertype === 'admin') {
    
    postButton.addEventListener('click', () => {
      window.location.href = `myprofile-posts/?userid=${userid}`;
    })
  }
  else {
    postButton.style.display = 'none';
  }

})
.catch(error => 
  console.error('error while fetching user data:',error));

