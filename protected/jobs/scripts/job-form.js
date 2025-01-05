import {base64convert as job_file, uploaddataonevent as post_job} from "../../protected-scripts/util.js"

const allowed_pic =['image/jpeg','image/png'];
let job_company_logo = '';
document.querySelector('#job_company_logo').addEventListener('input', (e) => {
  const file = e.target.files[0];
  document.querySelector('#logo_name').innerText = e.target.files[0].name;
  job_file(allowed_pic, file, (file64) => {
    job_company_logo = file64;
  })
})

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target.closest('form');
    const form_data = new FormData(form);
    let job_data = Object.fromEntries(form_data.entries());
    delete job_data.job_company_logo;
    job_data.job_company_logo = job_company_logo;
    const response = await post_job('submit-job', job_data)
    if(response.message.toLowerCase() === 'data submitted' ) {
      alert(response.message);
      window.location.href = '/protected/job-directory'
    }
})