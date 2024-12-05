import { formatEventDate } from "./util.js";

let eventHtml = '';


fetch(`https://localhost:8000/protected/events`)
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
      window.location.href =  `event?_id=${event_id}`;
      });
    });
  });
})
.catch(err => {
  console.log(err);
})



const searchInput = document.querySelector('.js-search-input');
const result = document.querySelector('.js-search-output');

let searchHtml = '';
searchInput.addEventListener('input', () =>{
  const input = document.querySelector('.js-search-input').value.trim();
  let debounce = '';
  clearTimeout(debounce);

  debounce = setTimeout(() => {
    if(input.trim() === '') {
      result.innerHTML = '';
      result.style.display = 'none';
    }
    else {
      result.style.display = 'grid';
    }
    fetch(`https://localhost:8000/protected/event-search?name=${encodeURIComponent(input)}`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })
  .then(data => {
    searchHtml = '';
    if(data.length === 0) {
        result.classList.add('show');
        result.innerHTML = `<div class="text js-text">No event with name "${input}" found</div> `;
        document.querySelector('.js-text').classList.add('show');
     }
    data.forEach(event =>{
      searchHtml +=`<div class="event js-event">
                <img class="e-event-icon" src=${event.event_logo}>
                <div class="event-info js-event-info">
                  <h1>${event.name}</h1>
                  <p class="event-date js-event-date" id="${event.date}">${formatEventDate(event.date)}</p>
                </div>
              </div>
`;
       result.innerHTML = searchHtml;
      setTimeout(() => {
        document.querySelectorAll('.js-event').forEach(event => {
          event.classList.add('show');
        });
      }, 10);
      result.classList.add('show');
      document.querySelectorAll('.js-event').forEach((event, index) => {
        event.addEventListener('click' ,() => {
          const event_id = data[index]._id;
          window.location.href =  `event.html?_id=${event_id}`;
        });
      });
    })
})
  .catch(err=> {
    console.error('error fetching data',err);
    result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
  })
 
}, 250)})
