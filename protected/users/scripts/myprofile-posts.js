
import {getdataonevent as getjob_event, formatEventDate, deletedataonevent} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search); 
const userid = urlParams.get('userid');
const data = await getjob_event(`my-jobs-events-posts/${userid}`);
const job_ids = data.data.job_ids;
const event_ids = data.data.event_ids;

let jobHtml = '';

if(job_ids.length > 0) {

  const jobPromises = job_ids.map(async (job) => {
    const data = await getjob_event(`job/${job.job_id}`);
    return {
      job_id: job.job_id,
      job_tittle: data.job_tittle,
      job_company_name: data.job_company_name,
      job_company_logo: data.job_company_logo,
      job_description: data.job_description
    };
    });

  const allJobsData = await Promise.all(jobPromises);
  const sortedJobsData = allJobsData.sort((a, b) => new Date(b.job_deadline) - new Date(a.job_deadline));
  
  sortedJobsData.forEach(async job => {
    jobHtml += `
              <div class="job js-job" job-id="${job.job_id}">
                <img class="job-pic" src="${job.job_company_logo}" loading="lazy">
                <div class="job-text">
                  <p>Job: ${job.job_tittle}</p>
                  <p>Employer: ${job.job_company_name}</p>
                </div>
              </div>
              <div class="delete-button-job js-delete-button-job" button-id="${job.job_id}">
                <img class="delete-button"  src="/images/delete.svg" >
              </div>
  `;
  })  
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

    const eventPromises = event_ids.map(async (event) => {
      const data = await getjob_event(`events/${event.event_id}`);
      return {
        event_id: event.event_id,
        name: data.name,
        event_logo: data.event_logo,
        event_date: data.date,
      };
    });
  
    const allEventsData = await Promise.all(eventPromises);
  
    const sortedEventsData = allEventsData.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  


    sortedEventsData.forEach( event => {
      eventHtml += `
                  <div class="event js-event" event-id="${event.event_id}">
                    <img class="event-pic" src="${event.event_logo}" loading="lazy">
                    <div class="event-text">
                    <p>Event Name: ${event.name}</p>
                    <p>Date & Time: ${formatEventDate(event.event_date)}</p>
                    </div>
                  </div>
                  <div class="delete-button-event js-delete-button-event" button-id="${event.event_id}">
                    <img class="delete-button js-delete-button" src="/images/delete.svg">
                  </div>
    `
    })
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