import { API_BASE_URL } from "./config.js";
import {upload as editprofilepic} from "./util.js";


fetch(`${API_BASE_URL}/protected/my-profile`)
.then( response => {
  if(!response.ok)
  {
    throw new Error('response was not ok');
  }
  return response.json();
})
.then((user) => {
  const userid = user.userid;
  const profilehtml = `
      <div class="user-page js-user-page">
        <div class="first-view">
          <div class="pic-box js-pic-box">
            <img class="user-pic" src="${user.personimage}">
            <div class="pic-label">
              <label for="input-image">
                <img class="user-pic-edit js-user-pic-edit" src="/images/edit.svg">
                <input type="file" id="input-image" class="image-upload js-image-upload" accept=".jpg,.png" style="display: none"> 
              </label>
            </div>
          </div>
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
        <div class="info-change js-info-change">
          <img class="user-info-edit js-user-pic-edit" src="/images/edit.svg">
          <div class="edit-tooltip-info">Edit Info</div>
        </div>
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

  const editinfoButton = document.querySelector('.js-info-change');
  editinfoButton.addEventListener('click', () => {
    window.location.href = `edit_profile_info`;
})

  document.querySelector('.js-image-upload').addEventListener('click', () => {

    const imagesallowed = ['image/jpeg', 'image/png'];
     editprofilepic('.js-image-upload', imagesallowed, true, '.js-image-upload', (file64) => {
      const data = ({
        file64, userid
      })
      fetch(`${API_BASE_URL}/protected/my-profile/edit-profile-pic`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('response not ok');
        }
        return response.json()
      })
      .then(data => {
        if(data.message === 'Profile picture changed') {
          alert(data.message);
          window.location.reload();
        }
        else {
          alert('An error has occured please try later')
        }
      })
  });
    
}) 

})
.catch(error => 
  console.error('error while fetching user data:',error)
);





