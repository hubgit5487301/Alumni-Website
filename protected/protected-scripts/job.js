import { formatjobdate , getdataonevent as getuser_id} from "./util.js";

const urlParam = new URLSearchParams(window.location.search);
const job_id = urlParam.get('_id');

fetch(`https://localhost:8000/protected/job/${job_id}`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json()
})
.then(data => {
  const jobHtml = `<div class="job-page js-job-page">
        <div class="first-view">
          <img class="job-pic" src="${data.job_company_logo}">
          <div class="basic-data">
            <p class="name">${data.job_tittle}</p>
            <div class="basic-data-details">
              <p>Employer : ${data.job_company_name}</p>
              <p>Last date to apply: ${formatjobdate(data.job_deadline)}</p>
              <p>Location: ${data.job_location}</p>
              <p>Job Type: ${data.job_level}</p>
              <p>Application Email: ${data.job_app_email}</p>
              <p>Salary: ${data.job_salary}</p>
            </div>
          </div>
        </div>
        <div class="job-requirement">
          <div class="job-headings">
            <h1>Requirements</h1>
          </div>
          <div class="job-req-details">
            <div class="req-text">
                <h2>Description:</h2> 
                <p>${data.job_des}</p>
            </div>
            <div class="short-info">
              <div class="req-text">
                <h2>Education:</h2>
                <p>${data.job_edu}</p>
              </div>
              <div class="req-text">
                <h2>Experience:</h2>
                <p>${data.job_exp_level} Years</p>
              </div>
              <div class="req-text">
                <h2>Work Hrs:</h2>
                <p>${data.job_type}</p>
              </div>
            </div>
            </div>
          </div>
        <div class="job-requirement">
          <div class="job-headings">
            <h1>Employer Info</h1>
          </div>
          <div class="job-req-details">
            <div class="req-text">
                <h2>Description:</h2> 
                <p>${data.job_company_des}</p>
            </div>
            <div class="short-info">
              <div class="req-text">
                <h2>Employer:</h2>
                <p>${data.job_company_name}</p>
              </div>
              <div class="req-text">
                <h2>Website:</h2>
                <a href="${data.job_company_website}">${data.job_company_website}</a>
              </div>
              <div class="req-text">
                <h2>Contact Info:</h2>
                <p>${data.job_contact_info}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-button js-submit-button">Apply</button>
`
  document.querySelector('.js-job-page').innerHTML = jobHtml;
  

  const applyButton = document.querySelector('.js-submit-button');

applyButton.addEventListener('click', async () => {
  const data = await getuser_id('/my-userid');
  const userid = data.userid;

  fetch()
})
})

