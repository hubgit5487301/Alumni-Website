import { formatjobdate, getdataonevent as get_data, button_disable} from "../../protected-scripts/util.js";

const urlParams = new URLSearchParams(window.location.search);
const job_id = urlParams.get('_id');
const response = await get_data(`job/${job_id}`);
const check = await get_data(`job_application_check/?job_id=${job_id}`);

document.querySelector('main section>section').style.backgroundImage = `url(${response.job_company_logo})`;

document.querySelector('#tittle').innerText = response.job_tittle;
document.querySelector('#job_name').innerText = response.job_tittle;
document.querySelector('#company_name').innerText = response.job_company_name

const applyButton = document.querySelector('#apply');
if(check.message.toLowerCase().trim() === 'already applied') {
  
  applyButton.innerText = 'Already Applied';
  button_disable(applyButton);
}
applyButton.addEventListener('click', async () => {
  const response = await get_data(`apply_job?job_id=${job_id}`);
  if(response.message === 'Applied to job') {
    alert(response.message);
    applyButton.innerText = 'Already Applied';
    button_disable(applyButton);
  }
})

document.querySelector('#salary').innerText = "Salary: "+response.job_salary + " Rs";
document.querySelector('#job_type').innerText = "Job Type: "+response.job_type;
document.querySelector('#app_email').innerText = "Email: "+response.job_app_email;
document.querySelector('#job_level').innerText = "Job Type: "+response.job_level;
document.querySelector('#deadline').innerText = "Deadline: "+formatjobdate(response.job_deadline);
document.querySelector('#location').innerText = "Location: "+response.job_location;
document.querySelector('#education').innerText = response.job_edu;
document.querySelector('#experience').innerText = response.job_exp_level + " Years";
document.querySelector('#job_description').innerText = response.job_des;
document.querySelector('#employer_description').innerText = response.job_company_des;
document. querySelector('#emp_website').innerText = response.job_company_website;
document. querySelector('#emp_website').href = response.job_company_website;
document.querySelector('#contact_info').innerText = response.job_contact_info;