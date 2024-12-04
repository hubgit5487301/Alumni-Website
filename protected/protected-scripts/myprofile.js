const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');


fetch(`https://localhost:8000/protected/my-profile`)
.then( response => {
  if(!response.ok)
  {
    throw new Error('response was not ok');
  }
  return response.json();
})
.then(user => {
const profilehtml = `
      <div class="user-page js-user-page">
        <div class="first-view">
          <img class="user-pic" src="${user.personimage}">
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
})
.catch(error => console.error('error while fetching user data:',error));
