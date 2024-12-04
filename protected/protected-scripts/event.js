
import { formatEventDate } from "./util.js";

const urlParams = new URLSearchParams(window.location.search);
const event_id = urlParams.get('_id');

if(event_id) {
  fetch(`https://localhost:8000/protected/events/${event_id}`)
  .then( response => {
      if(!response.ok) {
        throw new ErrorCreate('response not ok');
      }
      return response.json();
  })
  .then(event => {
    const eventHtml = `
          <div class="basic-details js-basic-details">
            <img class="event-pic" src=${event.event_logo}>
            <p class="name">${event.name}</p>
            <p class="date">${formatEventDate(event.date)}</p>
          </div>
          <div class="event-details js-event-details">
            <h1>Event Description</h1>
            <p>${event.event_des}</p>
            <h1>Event Location</h1>
            <p>${event.location}</p> 
            <h1>Contact Information</h1>
            <p>Email: ${event.contact_info.email}</p>
            <p>Phone No: ${event.contact_info.phone_no}</p>
          </div>
  `;         
  document.querySelector('.js-event-page').innerHTML = eventHtml;
  })
  .catch(err => {
    console.error('error while fetching event:',err);
  })
}

else {
  console.error('no event_id given');
}


