import { getdataonevent as get_data} from "../../protected-scripts/util.js";

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const query = Object.fromEntries(form_data.entries());
  if (!Array.from(form_data.values()).some(value => value.trim() !== '')) {
    alert('Form is empty! Please fill out at least one field.');
    return;
  }
  const query_string = new URLSearchParams(query).toString();
  const response = await get_data(`job_search?${query_string}`);
  if(response.length === 0) return;
  if(response.length !== 0) { 
    document.querySelector('.jobs').replaceChildren();
    document.querySelector('.jobs').style.gridTemplateColumns = "repeat(auto-fit, minmax(clamp(170px, 20%, 250px), 1fr))";
    render_jobs(response);
  }
  if(response.length === 1) document.querySelector('.jobs').style.gridTemplateColumns = "50%";
});

const name = document.querySelector('#name');
const emp_name = document.querySelector('#job_company_name');
const level = document.querySelector('#job_level');
const type = document.querySelector('#job_type');

async function form_state() {
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  if(data.job_tittle === '' && data.job_company_name === '' && data.job_level === '' && data.job_type === '') {
    document.querySelector('.jobs').innerText = '';
    document.querySelector('.jobs').style.gridTemplateColumns = "repeat(auto-fit, minmax(clamp(170px, 20%, 250px), 1fr))";
    load_jobs();
  }
}

name.addEventListener('input', form_state);
emp_name.addEventListener('input', form_state);
level.addEventListener('change', form_state);
type.addEventListener('change', form_state);

async function get_new_jobs(page) {
  return await get_data(`jobs?page=${page}&limit=10`);
}

async function load_jobs() {
    let current_page = 1;
    let loading = false;
    const data = await get_data(`jobs?page=${current_page}&limit=10`);
    render_jobs(data);
  
    const lastlistobserver = new IntersectionObserver(async (entries) => {
        const lastentry = entries[0];
        if(!lastentry.isIntersecting || loading) return;
        loading = true;
        const data = await get_new_jobs(current_page + 1);
        if(data.length === 0) {
          loading = false;
          return;
        }
        render_jobs(data);
        current_page++;
        lastlistobserver.unobserve(lastentry.target);
        lastlistobserver.observe(document.querySelector('.job:last-child'));
        loading = false;
    },{
      rootMargin: '100px'
    });
    const list = document.querySelector('.job:last-child');
    if (list) lastlistobserver.observe(list);
}

function render_jobs(data) {
  const job_window = document.querySelector('.jobs');
  data.forEach(job => {
    const li = document.createElement('li');
    const image = document.createElement('img');
    const section = document.createElement('section');
    const name = document.createElement('p');
    const emp_name = document.createElement('p');
    name.id = 'name';
    emp_name.id = 'emp_name';
    section.append(name,emp_name);
    li.append(image,section);
    li.setAttribute('job_id', job._id);
    li.classList.add('job');
    image.src = job.job_company_logo;
    name.innerText = job.job_tittle;
    emp_name.innerText = job.job_company_name;
    job_window.append(li);
  });
  const job_button = document.querySelectorAll('.job');
  job_button.forEach(button => {
    button.addEventListener('click', () => {
      const job_id = button.getAttribute('job_id');
      window.location.href = `job?_id=${job_id}`;
    });
  });
}

load_jobs();