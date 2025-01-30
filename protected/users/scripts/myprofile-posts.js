
import {getdataonevent as get_job_event, deletedataonevent as delete_post, create_element as create_post_element} from '../../protected-scripts/util.js';

const data = await get_job_event(`my-jobs-events-posts`);
let job_ids = data.job_ids;
let event_ids = data.event_ids;
const job_view = document.querySelector('#job_view');
const event_view = document.querySelector('#event_view');


function load_jobs(all_jobs) {
  if(all_jobs.length === 0) {
    default_jobs();
    return;
  }
  all_jobs.forEach(async (job) => {
    const job_data = await get_job_event(`my_profile_appli/my_jobs?_id=${job.job_id}`);
    const element = create_post_element();
    const img = element.querySelector('div');
    const p = element.querySelector('p');
    const button = element.querySelector('button');
    img.style.backgroundImage = `url(${job_data.job_company_logo})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    p.innerText = job_data.job_tittle;
    button.innerText = 'Delete';
    button.setAttribute('button-id', job.job_id);
    element.id = job.job_id;
    job_view.append(element);
    element.addEventListener('click', (e) => {
      if(e.target.closest('button')) return; 
      const _id = element.getAttribute('id');
      window.location.href = `/protected/applicants/job?_id=${_id}`;
      
    })
    button.addEventListener('click', async (e) => {
      const _id = button.getAttribute('button-id');
      const response = await delete_post(`my_profile_posts/delete_job?_id=${_id}`);
      if(response.message === 'Job post deleted') {
      document.getElementById(_id).remove();  
      all_jobs = all_jobs.filter((job) => job._id !== _id);
      job_ids = job_ids.filter((job) => job._id !== _id);
        if(job_view.childElementCount === 0) {
          if(job_view.value !== '') {
            load_jobs(job_ids);
          }
        }
      }
    });
  });
}

function load_events(all_events) {
  if(all_events.length === 0) {
    default_events();
    return;
  }
  all_events.forEach(async (event) => {
    const event_data = await get_job_event(`my_profile_appli/my_events?_id=${event.event_id}`);
    const element = create_post_element()
    const img = element.querySelector('div');
    const p = element.querySelector('p');
    const button = element.querySelector('button');
    img.style.backgroundImage = `url(${event_data.event_logo})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    element.setAttribute('event-id', event.event_id);
    button.setAttribute('button-id', event.event_id);
    button.innerText = 'Delete'
    element.id = event.event_id;
    p.innerText = event_data.name;
    document.querySelector('#event_view').append(element);
    element.addEventListener('click', () => {
      window.location.href = `/protected/event?_id=${event.event_id}`;
    });
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const _id = button.getAttribute('button-id');
      const response = await delete_post(`my_profile_post/delete_event?_id=${_id}`);
      if(response.message === 'event post deleted') {
        document.getElementById(_id).remove();
        all_events = all_events.filter((event) => event._id !== _id);
        event_ids = event_ids.filter((event) => event._id !== _id);
          if(document.querySelector('#event_view').childElementCount === 0) {
            if(document.querySelector('#event_search>input').value !== '') {
              load_events(event_ids);
          }
        }
      }
    });
  });
}

// load_events(event_ids);
load_jobs(job_ids);


async function default_jobs() {
  const p = document.createElement('p');
  p.style.height = '100%';
  p.style.width = '100%';
  p.style.textAlign = 'center';
  p.style.alignContent = 'center';
  p.innerText = 'You have not posted any jobs';
  document.querySelector('#job_view').append(p);
  document.querySelector('#job_search').style.display = 'none';
}

function default_events() {
  const p = document.createElement('p');
  p.style.height = '100%';
  p.style.width = '100%';
  p.style.textAlign = 'center';
  p.style.alignContent = 'center';
  p.innerText = 'You have not posted any events';
  document.querySelector('#event_view').append(p);
  document.querySelector('#event_search').style.display = 'none';
}


const job_form = document.querySelector('#job_search');
job_form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(job_form);
  const query = Object.fromEntries(form_data.entries());
  const query_string = new URLSearchParams(query).toString();
  const response = await get_job_event(`my_profile_posts/job_search?${query_string}`);
  if(response.length > 0) {
    document.querySelector('#job_view').replaceChildren();
    load_jobs(response);
  }
  else if(response.length === 0) {
    const p = document.createElement('p');
    document.querySelector('#job_view').replaceChildren();
    p.style.height = '100%';
    p.style.width = '100%';
    p.style.textAlign = 'center';
    p.style.alignContent = 'center';
    p.innerText = 'No jobs found with provided parameters';
    document.querySelector('#job_view').append(p);
  }
})

const event_form = document.querySelector('#event_search');
event_form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(event_form);
  const query = Object.fromEntries(form_data.entries());
  const query_string = new URLSearchParams(query).toString();
  const response = await get_job_event(`my_profile_posts/event_search?${query_string}`);
  if(response.length > 0) {
    document.querySelector('#event_view').replaceChildren()
    load_events(response);
  }
  else {
    const p = document.createElement('p');
    document.querySelector('#event_view').replaceChildren();
    p.style.height = '100%';
    p.style.width = '100%';
    p.style.textAlign = 'center';
    p.style.alignContent = 'center';
    p.innerText = 'No events found with provided parameters';
    document.querySelector('#event_view').append(p);
  }
})

function job_form_state() {
  const form_data = new FormData(job_form);
  const data = Object.fromEntries(form_data.entries());
  if(data.job_tittle === '' ) {
    document.querySelector('#job_view').replaceChildren();
    load_jobs(job_ids);
  }
}

function event_form_state() {
  const form_data = new FormData(event_form);
  const data = Object.fromEntries(form_data.entries());
  if(data.event_name === '' ) {
    event_view.replaceChildren();
    load_events(event_ids);
  }
}

document.querySelector('#event_search_input').addEventListener('input', event_form_state)
document.querySelector('#job_search_input').addEventListener('input', job_form_state);