
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
      if(e.target.tagName !== 'BUTTON') window.location.href = `/protected/job?_id=${job.job_id}`;
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

load_events(event_ids);
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

document.querySelector('#job_search_input').addEventListener('input', job_form_state);
// let jobHtml = '';
// let sortedJobsData = [];

// if (job_ids.length > 0) {

//   const jobPromises = job_ids.map(async (job) => {
//     const data = await getjob_event(`job/${job.job_id}`);
//     return {
//       job_id: job.job_id,
//       job_tittle: data.job_tittle,
//       job_company_name: data.job_company_name,
//       job_company_logo: data.job_company_logo,
//       job_description: data.job_description
//     };
//   });

//   const allJobsData = await Promise.all(jobPromises);
//   sortedJobsData = allJobsData.sort((a, b) => new Date(b.job_deadline) - new Date(a.job_deadline));


//   renderJobs(sortedJobsData);


//   const searchInput = document.querySelector('.js-job-search');
//   searchInput.addEventListener('input', (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     const filteredJobs = sortedJobsData.filter(job =>
//       job.job_tittle.toLowerCase().startsWith(searchTerm)
//     );
//     renderJobs(filteredJobs);
//   });
// } else {
//   jobHtml = `
//     <div class="j">
//         <p class="no-data">You have not posted any Jobs</p>
//     </div>
//   `;
//   document.querySelector('.js-data-jobs').innerHTML = jobHtml;
// }

// function renderJobs(jobs) {
//   let jobHtml = '';
//   jobs.forEach(job => {
//     jobHtml += `
//       <div class="job js-job" job-id="${job.job_id}">
//         <img class="job-pic" src="${job.job_company_logo}" loading="lazy">
//         <div class="job-text">
//           <p>Job: ${job.job_tittle}</p>
//           <p>Employer: ${job.job_company_name}</p>
//         </div>
//       </div>
//       <div class="delete-button-job js-delete-button-job" button-id="${job.job_id}">
//         <img class="delete-button" src="/images/delete.svg">
//       </div>
//     `;
//   });
//   document.querySelector('.js-data-jobs').innerHTML = jobHtml;


//   const jobButtons = document.querySelectorAll('.js-job');
//   jobButtons.forEach(jobButton => {
//     jobButton.addEventListener('click', () => {
//       const job_id = jobButton.getAttribute('job-id');
//       window.location.href = `/protected/applicants/job?job_id=${job_id}`;
//     });
//   });

//   const deleteButtons = document.querySelectorAll('.js-delete-button-job');
//   deleteButtons.forEach(deleteButton => {
//     deleteButton.addEventListener('click', async () => {
//       const job_id = deleteButton.getAttribute('button-id');
//       const data = await deletedataonevent(`myprofile-posts/${userid}/delete-job/${job_id}`);
//       if (data.message === 'Job post deleted') {
//         const jobElement = document.querySelector(`.job.js-job[job-id="${job_id}"]`);
//         const deleteButtonElement = document.querySelector(`.delete-button-job.js-delete-button-job[button-id="${job_id}"]`);
//         if (jobElement) {
//           jobElement.remove();}
//         if (deleteButtonElement) deleteButtonElement.remove();
//       }
//     });
//   });
// }


// let eventHtml = '';
// let sortedEventsData = [];

// if (data.usertype === 'admin') {
//   const box = document.querySelector('.js-event-box');
//   box.style.display = 'flex';
//   const main_box = document.querySelector('.js-profile-appli-page');
//   main_box.classList.remove('profile-appli-page-1');
//   main_box.classList.add('profile-appli-page-2');

//   if (event_ids.length > 0) {
//     const eventPromises = event_ids.map(async (event) => {
//       const data = await getjob_event(`events/${event.event_id}`);
//       return {
//         event_id: event.event_id,
//         name: data.name,
//         event_logo: data.event_logo,
//         event_date: data.date,
//       };
//     });

//     const allEventsData = await Promise.all(eventPromises);
//     sortedEventsData = allEventsData.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  
//     renderEvents(sortedEventsData);

  
//     const searchInput = document.querySelector('.js-event-search');
//     searchInput.addEventListener('input', (event) => {
//       const searchTerm = event.target.value.toLowerCase();
//       const filteredEvents = sortedEventsData.filter(event =>
//         event.name.toLowerCase().startsWith(searchTerm)
//       );
//       renderEvents(filteredEvents);
//     });
//   } else {
//     eventHtml = `
//       <div class="e">
//         <p class="no-data">You have not posted any Events</p>
//       </div>
//     `;
//     document.querySelector('.js-data-events').innerHTML = eventHtml;
//   }
// }

// function renderEvents(events) {
//   let eventHtml = '';
//   events.forEach(event => {
//     eventHtml += `
//       <div class="event js-event" event-id="${event.event_id}">
//         <img class="event-pic" src="${event.event_logo}" loading="lazy">
//         <div class="event-text">
//           <p>Event Name: ${event.name}</p>
//           <p>Date & Time: ${formatEventDate(event.event_date)}</p>
//         </div>
//       </div>
//       <div class="delete-button-event js-delete-button-event" button-id="${event.event_id}">
//         <img class="delete-button js-delete-button" src="/images/delete.svg">
//       </div>
//     `;
//   });
//   document.querySelector('.js-data-events').innerHTML = eventHtml;


//   const eventButtons = document.querySelectorAll('.js-event');
//   eventButtons.forEach(eventButton => {
//     eventButton.addEventListener('click', () => {
//       const event_id = eventButton.getAttribute('event-id');
//       window.location.href = `/protected/applicants/event?event_id=${event_id}`;
//     });
//   });

//   const deleteButtons = document.querySelectorAll('.js-delete-button-event');
//   deleteButtons.forEach(deleteButton => {
//     deleteButton.addEventListener('click', async () => {
//       const event_id = deleteButton.getAttribute('button-id');
//       const data = await deletedataonevent(`myprofile-posts/${userid}/delete-event/${event_id}`);
//       if (data.message === 'event post deleted') {
//         const jobElement = document.querySelector(`.event.js-event[event-id="${event_id}"]`);
//         const deleteButtonElement = document.querySelector(`.delete-button-event.js-delete-button-event[button-id="${event_id}"]`);
//         if (jobElement) {
//           jobElement.remove();}
//         if (deleteButtonElement) deleteButtonElement.remove();

      
//       }
//     });
//   });
// }
