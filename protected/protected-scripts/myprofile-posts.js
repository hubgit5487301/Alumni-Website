import { API_BASE_URL } from "./config.js";
import {getdataonevent as getjob_event, formatEventDate, deletedataonevent} from './util.js';

const urlParams = new URLSearchParams(window.location.search); 
const userid = urlParams.get('userid');
const data = await getjob_event(`my-jobs-events-posts/${userid}`);
const job_ids = data.data.job_ids;
const event_ids = data.data.event_ids;
const usertype = data.usertype;

let jobHtml = '';

if(job_ids.length > 0) {
  job_ids.forEach(async job => {
    const data = await getjob_event(`job/${job.job_id}`);
    jobHtml += `
              <div class="job js-job" job-id="${job.job_id}">
                <img class="job-pic" src="${data.job_company_logo}">
                <div class="job-text">
                  <p>Job: ${data.job_tittle}</p>
                  <p>Employer: ${data.job_company_name}</p>
                </div>
              </div>
              <div class="delete-button-job js-delete-button-job" button-id="${job.job_id}">
                <img class="delete-button"  src="/images/delete.svg">
              </div>
  `;
    
    document.querySelector('.js-data-jobs').innerHTML = jobHtml;
    const jobButton = document.querySelectorAll('.js-job');
    jobButton.forEach(jobButton => {
        jobButton.addEventListener('click', () => {
        const job_id = jobButton.getAttribute('job-id')
        window.location.href = `/protected/applicants/job?job_id=${job_id}`;
        })
      })

    const deleteButton = document.querySelectorAll('.js-delete-button-job');
    deleteButton.forEach(deleteButton => {
      deleteButton.addEventListener('click', async () => {
        const job_id = deleteButton.getAttribute('button-id');
        const data = await deletedataonevent(`myprofile-posts/${userid}/delete-job/${job_id}`);
        if(data.message === 'Job post deleted')
          alert('Job post deleted');
        window.location.reload();
        
      })
  })

  })
}


else {
  jobHtml = `
  <div class="j">
      <p class="no-data">You have not posted any Jobs</p>
  </div>
`;

document.querySelector('.js-data-jobs').innerHTML = jobHtml;
}

let eventHtml = '';
if (data.usertype === 'admin') {
  const box = document.querySelector('.js-event-box');
  box.style.display = 'flex';
  const main_box = document.querySelector('.js-profile-appli-page');
  main_box.classList.remove('profile-appli-page-1');
  main_box.classList.add('profile-appli-page-2');

  if(event_ids.length >0) {
    event_ids.forEach( async event => {
      try {
      const data =  await getjob_event(`events/${event.event_id}`);
      eventHtml += `
                  <div class="event js-event" event-id="${event.event_id}">
                    <img class="event-pic" src="${data.event_logo}">
                    <div class="event-text">
                    <p>Event Name: ${data.name}</p>
                    <p>Date & Time: ${formatEventDate(data.date)}</p>
                    </div>
                  </div>
                  <div class="delete-button-event js-delete-button-event" button-id="${event.event_id}">
                    <img class="delete-button js-delete-button" src="/images/delete.svg">
                  </div>
    `
      document.querySelector('.js-data-events').innerHTML = eventHtml;

      const eventButton = document.querySelectorAll('.js-event');
      eventButton.forEach(eventButton => {
        eventButton.addEventListener('click', ()=> {
          const event_id = eventButton.getAttribute('event-id');
          window.location.href= `/protected/applicants/event?event_id=${event_id}`;
        })
      })

      const deleteButton = document.querySelectorAll('.js-delete-button-event');
      deleteButton.forEach(deleteButton => {
        deleteButton.addEventListener('click', async () => {
          const event_id = deleteButton.getAttribute('button-id');
          const data = await deletedataonevent(`myprofile-posts/${userid}/delete-event/${event_id}`);
          if(data.message === 'event post deleted')
            alert('Event post deleted');
          window.location.reload();
          
        })
    })}
    catch(err){
      console.log(err);
    }
    })
  }
  else {
    eventHtml = `
                  <div class="e">
                    <p class="no-data">You have not posted any Events</p>
                  </div>
    `
      document.querySelector('.js-data-events').innerHTML = eventHtml;
  }
}
else {
}
