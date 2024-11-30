import { formatEventDate } from "./util.js";

let eventHtml = '';


fetch(`http://localhost:8000/protected/events`)
 .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
 })

 .then(data => {
    data.forEach((event) => {
        eventHtml += 
        `<div class="event js-event">
                <img class="e-event-icon" src=${event.event_logo}>
                <div class="event-info js-event-info">
                  <h1>${event.name}</h1>
                  <p class="event-date js-event-date" id="${event.date}">${formatEventDate(event.date)}</p>
                </div>
              </div>
`;
document.querySelector('.js-events-row').innerHTML = eventHtml;
document.querySelectorAll('.js-event').forEach((event, index) => {
      event.addEventListener('click' ,() => {
        const event_id = data[index]._id;
        window.location.href =  `event.html?_id=${event_id}`;
      });
    });
});});

