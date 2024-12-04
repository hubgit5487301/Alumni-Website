import { formatjobdate } from "./util.js";

fetch(`https://localhost:8000/protected/jobs`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json()
})
.then(jobs => {
  let jobsHtml = '';
  jobs.forEach( job => {
    jobsHtml += `<div class="job js-job">
  <img class="j-job-icon js-job-icon" src="${job.job_company_logo}">
  <div class="job-info js-job-info">
    <h1>${job.job_tittle}</h1>
    <h2>${job.job_company_name}</h2>
    <p>Level: ${job.job_level}</p>
    <p>Type: ${job.job_type}</p>
    <p>Last date: ${formatjobdate(job.job_deadline)}</p>
  </div>
</div>
`})
document.querySelector('.js-job-row').innerHTML = jobsHtml;
document.querySelectorAll('.js-job').forEach((job, index) => {
job.addEventListener('click', () => {
  const job_id = jobs[index]._id;
  window.location.href = `job?_id=${job_id}`;
})
})

})

