import {getdataonevent as get_data, deletedataonevent as delete_data, formatjobdate } from './util.js'

document.querySelector('.active').classList.remove('active');
document.querySelector('nav>li:nth-child(4)').classList.add('active');

const {full_time, part_time, internships, contract} = await get_data('manage_jobs/jobs');

const full_time_jobs_button = document.querySelector('#full_time_jobs');
const part_time_jobs_button = document.querySelector('#part_time_jobs');
const internships_button = document.querySelector('#internship_jobs');
const contract_jobs_button = document.querySelector('#contract_jobs');

const full_time_jobs_table = document.querySelector('#all_full_time_jobs');
const part_time_jobs_table = document.querySelector('#all_part_time_jobs');
const internships_table = document.querySelector('#all_internship_jobs');
const contract_jobs_table = document.querySelector('#all_contract_jobs');

const table_container = document.querySelector('#all_jobs');
const show_table = (table, button_id) => {
  table_container.style.transform = `translateX(-${table * 25}%)`;
  document.querySelector('.button_active').classList.remove('button_active')
  document.getElementById(button_id).classList.add('button_active');
}

full_time_jobs_button.addEventListener('click', () => {show_table(0, 'full_time_jobs')});
part_time_jobs_button.addEventListener('click', () => {show_table(1, 'part_time_jobs')});
internships_button.addEventListener('click', () => {show_table(2, 'internship_jobs')});
contract_jobs_button.addEventListener('click', () => {show_table(3, 'contract_jobs')});


function create_table(data, table, job_type) {
  if(data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerText = 'No jobs to show';
    td.colSpan = 8;
    td.style.textAlign = 'center';
    tr.append(td);
    table.append(tr);
    return;
  }
  data.forEach(job => {
    const tr = document.createElement('tr');
    tr.setAttribute('job_id', job._id);
    tr.id = `job_row_${job_type}`;
    const job_tittle_td = document.createElement('td');
    job_tittle_td.innerText = job.job_tittle;
    
    const job_company_td = document.createElement('td');
    job_company_td.innerText = job.job_company_name;

    const job_location_td = document.createElement('td');
    job_location_td.innerText = job.job_location;

    const job_salary_td = document.createElement('td');
    job_salary_td.innerText = job.job_salary;

    const job_deadline_td = document.createElement('td');
    job_deadline_td.innerText = formatjobdate(job.job_deadline);

    const job_applicants_td = document.createElement('td');
    job_applicants_td.innerText = job.applicants_count;

    const job_status_td = document.createElement('td');
    if(new Date(job.job_deadline) < new Date().getTime()) job_status_td.innerText = 'Expired';
    else job_status_td.innerText = 'Active';

    const delete_button = document.createElement('button');
    delete_button.innerText = 'Delete';
    delete_button.setAttribute('job_id', job._id);
    const delete_button_td = document.createElement('td');
    delete_button_td.append(delete_button);
    tr.append(job_tittle_td, job_company_td, job_location_td, job_salary_td, job_deadline_td, job_applicants_td, job_status_td, delete_button_td);
    table.append(tr);
  });

  document.querySelectorAll(`#job_row_${job_type}`).forEach(button => {
    button.addEventListener('click', async (e) => {
      if(e.target.tagName === 'BUTTON') return;
      const _id = button.getAttribute('job_id');
      window.location.href = `/protected/applicants/job?_id=${_id}`;
    })
  }) 
  
  document.querySelectorAll(`#job_row_${job_type} button`).forEach(button => {
    button.addEventListener('click', async (e) => {
      const job_id = button.getAttribute('job_id');
      const response = await delete_data(`manage_jobs/remove_job?_id=${job_id}`);
      if(response.message.toLowerCase() === 'job deleted'){
        button.parentElement.parentElement.remove();
      }
    })
  })
}

create_table(full_time, full_time_jobs_table, 'full_time');
create_table(part_time, part_time_jobs_table, 'part_time');
create_table(internships, internships_table, 'internship');
create_table(contract, contract_jobs_table, 'contract');


const form = document.querySelector('#search_form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const search_query = Object.fromEntries(form_data.entries());
  if (!Array.from(form_data.values()).some(value => value.trim() !== '')) {
    alert('Please enter a search query');
    return;
  }
  const response = await get_data(`manage_jobs/search_jobs?${new URLSearchParams(search_query)}`);
  create_search_table(response, document.querySelector('#search_result'));
});


function create_search_table(data, table) {
  table.innerText = '';
  if(data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerText = 'No jobs found';
    td.colSpan = 8;
    td.style.textAlign = 'center';
    tr.append(td);
    table.append(tr);
  }
  data.forEach(job => {
    const tr = document.createElement('tr');
    tr.setAttribute('job_id', job._id);
    tr.id = `job_row`;
    const job_tittle_td = document.createElement('td');
    job_tittle_td.innerText = job.job_tittle;
    
    const job_company_td = document.createElement('td');
    job_company_td.innerText = job.job_company_name;

    const job_location_td = document.createElement('td');
    job_location_td.innerText = job.job_location;

    const job_salary_td = document.createElement('td');
    job_salary_td.innerText = job.job_salary;

    const job_deadline_td = document.createElement('td');
    job_deadline_td.innerText = formatjobdate(job.job_deadline);

    const job_applicants_td = document.createElement('td');
    job_applicants_td.innerText = job.applicants_count;

    const job_status_td = document.createElement('td');
    if(new Date(job.job_deadline) < new Date().getTime()) job_status_td.innerText = 'Expired';
    else job_status_td.innerText = 'Active';

    const delete_button = document.createElement('button');
    delete_button.innerText = 'Delete';
    delete_button.setAttribute('job_id', job._id);
    const delete_button_td = document.createElement('td');
    delete_button_td.append(delete_button);
    tr.append(job_tittle_td, job_company_td, job_location_td, job_salary_td, job_deadline_td, job_applicants_td, job_status_td, delete_button_td);
    table.append(tr);
  });

  document.querySelectorAll(`#job_row`).forEach(button => {
    button.addEventListener('click', async (e) => {
      if(e.target.tagName === 'BUTTON') return;
      const _id = button.getAttribute('job_id');
      window.location.href = `/protected/applicants/job?_id=${_id}`;
    })
  }) 
  
  document.querySelectorAll(`#job_row button`).forEach(button => {
    button.addEventListener('click', async (e) => {
      const job_id = button.getAttribute('job_id');
      const response = await delete_data(`manage_jobs/remove_job?_id=${job_id}`);
      if(response.message.toLowerCase() === 'job deleted'){
        button.parentElement.parentElement.remove();
      }
    })
  })
}


function form_state() {
  const form = document.querySelector('#search_form');
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  if(data.job_tittle.trim() === '' && data.job_location.trim() === '' && data.job_status.trim() === '' && data.job_company_name.trim() === '') {
    document.querySelector('#search_result').innerText = '';
  }
}

document.querySelector('#search_by_job_name').addEventListener('input', form_state);
document.querySelector('#search_by_status').addEventListener('change', form_state);
document.querySelector('#search_by_location').addEventListener('input', form_state);
document.querySelector('#search_by_company').addEventListener('input', form_state);