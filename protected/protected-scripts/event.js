
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
        <div class="first-view">
          <img class="event-pic" src="${event.event_logo}">
          <div class="basic-data">
            <p class="name">${event.name}</p>
            <div class="basic-data-details">
              <p>Event Date & Time: ${formatEventDate(event.date)}</p>
            </div>
          </div>
        </div>
        <div class="event-requirement">
          <div class="event-req-details">
            <div class="req-text">
                <h2>Description:</h2> 
                <p>${event.event_des}</p>
            </div>
            <div class="short-info">
              <div class="req-text">
                <h2>Location:</h2>
                <p>${event.location}</p>
              </div>
              <div class="req-text">
                <h2>Phone No:</h2>
                <p>${event.contact_info.phone_no}</p>
              </div>
              <div class="req-text">
                <h2>Email:</h2>
                <p>${event.contact_info.email}</p>
              </div>
            </div
          </div>
        </div>
      <button class="submit-button js-submit-button">Apply</button>
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


