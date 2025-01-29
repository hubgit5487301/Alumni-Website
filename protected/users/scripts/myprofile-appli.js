
import {getdataonevent as get_job_event, deletedataonevent as delete_appli,create_element as create_application_element} from '../../protected-scripts/util.js';

const data = await get_job_event(`my-jobs-events-applied`);

let event_ids = data.all_events_ids;
let job_ids = data.all_jobs_ids;

function load_jobs(all_jobs) {
  if(all_jobs.length === 0) {
    default_jobs();
    return;
  }

  all_jobs.forEach(async (job) => {
    const job_data = await get_job_event(`my_profile_appli/my_jobs?_id=${job._id}`);
    const element = create_application_element();
    const img = element.querySelector('div');
    const p = element.querySelector('p');
    const button = element.querySelector('button');
    img.style.backgroundImage = `url(${job_data.job_company_logo})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    element.setAttribute('job-id', job._id);
    button.setAttribute('button-id', job._id);
    element.id = job._id;
    p.innerText = job_data.job_tittle;
    document.querySelector('#job_view').append(element);
    element.addEventListener('click', () => {
      window.location.href = `/protected/job?_id=${job._id}`;
    });
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const _id = button.getAttribute('button-id');
      const response = await delete_appli(`my_profile_appli/delete_job?_id=${_id}`);
      if(response.message === 'job application removed') {
        document.getElementById(_id).remove();
        all_jobs = all_jobs.filter((job) => job._id !== _id);
        job_ids = job_ids.filter((job) => job._id !== _id);
          if(document.querySelector('#job_view').childElementCount === 0) {
            if(document.querySelector('#job_search>input').value !== '') {
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
    const event_data = await get_job_event(`my_profile_appli/my_events?_id=${event._id}`);
    const element = create_application_element();
    const img = element.querySelector('div');
    const p = element.querySelector('p');
    const button = element.querySelector('button');
    img.style.backgroundImage = `url(${event_data.event_logo})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    element.setAttribute('event-id', event._id);
    button.setAttribute('button-id', event._id);
    element.id = event._id;
    p.innerText = event_data.name;
    document.querySelector('#event_view').append(element);
    element.addEventListener('click', () => {
      window.location.href = `/protected/event?_id=${event._id}`;
    });
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const _id = button.getAttribute('button-id');
      const response = await delete_appli(`my_profile_appli/delete_event?_id=${_id}`);
      if(response.message === 'event application removed') {
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

async function default_jobs() {
  const check = await get_job_event(`my-jobs-events-applied`);
  const p = document.createElement('p');
  p.style.height = '100%';
  p.style.width = '100%';
  p.style.textAlign = 'center';
  p.style.alignContent = 'center';
  p.innerText = 'You have not applied to any jobs';
  document.querySelector('#job_view').append(p);
  document.querySelector('#job_search').style.display = 'none';
}

function default_events() {
  const p = document.createElement('p');
  p.style.height = '100%';
  p.style.width = '100%';
  p.style.textAlign = 'center';
  p.style.alignContent = 'center';
  p.innerText = 'You have not applied to any events';
  document.querySelector('#event_view').append(p);
  document.querySelector('#event_search').style.display = 'none';
}

load_jobs(job_ids);
load_events(event_ids);

const job_form = document.querySelector('#job_search');
job_form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(job_form);
  const query = Object.fromEntries(form_data.entries());
  const query_string = new URLSearchParams(query).toString();
  const response = await get_job_event(`my_profile_appli/job_search?${query_string}`);
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
  const response = await get_job_event(`my_profile_appli/event_search?${query_string}`);
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

document.querySelector('#job_search_input').addEventListener('input', job_form_state);