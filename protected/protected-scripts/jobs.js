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
    jobsHtml += `
    <div class="job js-job">
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


const searchInput = document.querySelector('.js-search-input');
const result = document.querySelector('.js-search-output');

let searchHtml = '';
searchInput.addEventListener('input', () =>{
  const input = document.querySelector('.js-search-input').value.trim();
  let debounce = '';
  clearTimeout(debounce);

  debounce = setTimeout(() => {
    if(input.trim() === '') {
      result.innerHTML = '';
      result.style.display = 'none';
    }
    else {
      result.style.display = 'grid';
    }
    fetch(`https://localhost:8000/protected/job-search?name=${encodeURIComponent(input)}`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })
  .then(data => {
    searchHtml = '';
    if(data.length === 0) {
        result.classList.add('show');
        result.innerHTML = `<div class="text js-text">No job with name "${input}" found</div> `;
        document.querySelector('.js-text').classList.add('show');
     }
    data.forEach(job =>{
      searchHtml +=`<div class="job-search js-job">
      <img class="j-job-icon-search js-job-icon" src="${job.job_company_logo}">
      <div class="job-info-search js-job-info">
        <h1>${job.job_tittle}</h1>
        <h2>${job.job_company_name}</h2>
        <p>Level: ${job.job_level}</p>
        <p>Type: ${job.job_type}</p>
        <p>Last date: ${formatjobdate(job.job_deadline)}</p>
      </div>
      </div>
`;
       result.innerHTML = searchHtml;
      setTimeout(() => {
        document.querySelectorAll('.js-job').forEach(job => {
          job.classList.add('show');
        });
      }, 10);
      result.classList.add('show');
      document.querySelectorAll('.js-job').forEach((job, index) => {
        job.addEventListener('click' ,() => {
          const job_id = data[index]._id;
          window.location.href =  `job?_id=${job_id}`;
        });
      });
    })
})
  .catch(err=> {
    console.error('error fetching data',err);
    result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
  })
 
}, 250)})


