//

fetch(`https://localhost:8000/protected/jobs`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json()
})
.then(jobs => {
  let jobsHtml = '';
  console.log(jobs);
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
</div>`
  })
  document.querySelector('.js-job-row').innerHTML = jobsHtml;

})


export function formatjobdate(jobdate) {
  const date = new Date(jobdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}`;
}
