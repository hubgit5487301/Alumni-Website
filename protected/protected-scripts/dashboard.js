import { getdataonevent as getdata, formatEventDate } from "./util.js";

const data = await getdata('user_name');
const span = document.createElement('span');
const link = document.createElement('a');
const user = document.querySelector(".user-welcome");
user.innerText = 'Hi, ';
user.append(link);
link.classList.add('user-link');
link.href = '/protected/my-profile-page';
document.querySelector('.user-link').append(span);
span.classList.add('user-name'); 
span.append(' ' + data.user_name);











// let eventHtml = '';

// fetch(`${API_BASE_URL}/protected/homeevents`)
// .then(response => {
//   if(!response.ok) {
//     throw new Error('response not ok')
//   }
//   return response.json();
// })

// .then(data => {
//   data.forEach((event) => {
//     eventHtml +=`
//       <div class="bottom-second-event-box js-bottom-second-event-box">
//         <img class="event-image" src="${event.event_logo}"  loading="lazy">
//         <div class="event-info">
//           <p class="event-info-text">${event.name}</p>
//           <p class="event-info-text-1 js-event-info-text-1" id="${event.date}">${formatEventDate(event.date)}</p>
//         </div>
//       </div>`;});
//     document.querySelector('.js-bottom-second-event-boxes').innerHTML = eventHtml;
//     document.querySelectorAll('.js-bottom-second-event-box').forEach((event, index) => {
//         event.addEventListener('click' ,() => {
//         const event_id = data[index]._id;
//         window.location.href = `protected/event?_id=${event_id}`;
//     });
// });});


// let wheel = document.querySelector('.js-bottom-second-event-boxes');
// wheel.addEventListener('wheel', (event) => {
//   event.preventDefault(); 
//   wheel.scrollLeft += event.deltaY; }, { passive: false })