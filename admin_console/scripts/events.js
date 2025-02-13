import {getdataonevent as get_data, deletedataonevent as delete_data,formatEventDate } from './util.js'

document.querySelector('.active').classList.remove('active');
document.querySelector('nav>li:nth-child(3)').classList.add('active');

const {past_events, today_events, upcoming_events} = await get_data('manage_events/events');

const all_past_events_button = document.querySelector('#past_events_button');
const all_active_events_button = document.querySelector('#active_events_button');
const all_upcoming_events_button = document.querySelector('#upcoming_events_button');

const past_events_table = document.querySelector('#all_past_events>tbody');
const active_events_table = document.querySelector('#all_today_events'); 
const upcoming_events_table = document.querySelector('#all_upcoming_events');

const table_container = document.querySelector('#all_events');
const show_table = (table, button_id) => {
  table_container.style.transform = `translateX(-${table * 33.3}%)`;
  document.querySelector('.button_active').classList.remove('button_active')
  document.getElementById(button_id).classList.add('button_active');
}


all_past_events_button.addEventListener('click', () => {show_table(0, 'past_events_button')});
all_active_events_button.addEventListener('click', () => {show_table(1, 'active_events_button')});
all_upcoming_events_button.addEventListener('click', () => {show_table(2, 'upcoming_events_button');})


function create_table(data, table, event_type) {
  if(data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerText = 'No events to show';
    td.colSpan = 7;
    td.style.textAlign = 'center';
    tr.append(td);
    table.append(tr);
    return;
  }

  data.forEach(event => {
    const tr = document.createElement('tr');

    const name_td = document.createElement('td');
    name_td.innerText = event.name;

    const date_td = document.createElement('td');
    date_td.innerText = formatEventDate(event.date);

    const location_td = document.createElement('td');
    location_td.innerText = event.location;

    const email_td = document.createElement('td');
    email_td.innerText = event.contact_info.email;

    const applicants_td = document.createElement('td');
    applicants_td.innerText = event.applicants_count;

    const delete_button_td = document.createElement('td');
    const delete_button = document.createElement('button');
    delete_button.innerText = 'Delete Event'
    delete_button.setAttribute('event_button_id', `${event._id}`);
    delete_button.id = `delete_event_${event_type}`;
    delete_button_td.append(delete_button);

    tr.append(name_td, date_td, location_td, email_td, applicants_td, delete_button_td);
    tr.id = `event_row_${event_type}`;
    tr.setAttribute('event_id', `${event._id}`);
    table.append(tr);
  });

  document.querySelectorAll(`#event_row_${event_type}`).forEach(button => {
    button.addEventListener('click', async (e) => {
      if(e.target.tagName === 'BUTTON') return;
      const event_id = button.getAttribute('event_id');
      window.location.href = `manage_event?_id=${event_id}`;
    });
  });

  document.querySelectorAll(`#delete_event_${event_type}`).forEach(button => {
    button.addEventListener('click', async (e) => {
      const _id = button.getAttribute('event_button_id');
      const response = await delete_data(`manage_events/remove_event?_id=${_id}`);
      if(response.message === 'event deleted') {
        button.parentElement.parentElement.remove();
      }
    });
  });
}

create_table(past_events, past_events_table, 'past');
create_table(today_events, active_events_table, 'today');
create_table(upcoming_events, upcoming_events_table, 'upcoming');


const form = document.querySelector('#search_form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const search_query = Object.fromEntries(form_data.entries());
  if (!Array.from(form_data.values()).some(value => value.trim() !== '')) {
    alert('Please enter a search query');
    return;
  }
  const response = await get_data(`manage_events/search_events?${new URLSearchParams(search_query)}`);
  const search_table = document.querySelector('#search_result');
  create_search_table(response, search_table);
})


function create_search_table(data, table) {
  table.innerText = '';
  if(data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerText = 'No events found';
    td.colSpan = 7;
    td.style.textAlign = 'center';
    tr.append(td);
    table.append(tr);
    return;
  }

  data.forEach(event => {
    const tr = document.createElement('tr');

    const name_td = document.createElement('td');
    name_td.innerText = event.name;

    const date_td = document.createElement('td');
    date_td.innerText = formatEventDate(event.date);

    const location_td = document.createElement('td');
    location_td.innerText = event.location;

    const email_td = document.createElement('td');
    email_td.innerText = event.contact_info.email;

    const applicants_td = document.createElement('td');
    applicants_td.innerText = event.applicants_count;

    const delete_button_td = document.createElement('td');
    const delete_button = document.createElement('button');
    delete_button.innerText = 'Delete Event'
    delete_button.setAttribute('event_button_id', `${event._id}`);
    delete_button.id = `delete_event`;
    delete_button_td.append(delete_button);

    tr.append(name_td, date_td, location_td, email_td, applicants_td, delete_button_td);
    tr.id = `event_row`;
    tr.setAttribute('event_id', `${event._id}`);
    table.append(tr);
  });

  document.querySelectorAll(`#event_row`).forEach(button => {
    button.addEventListener('click', async (e) => {
      if(e.target.tagName === 'BUTTON') return;
      const event_id = button.getAttribute('event_id');
      window.location.href = `manage_event?_id=${event_id}`;
    });
  });

  document.querySelectorAll(`#delete_event`).forEach(button => {
    button.addEventListener('click', async (e) => {
      const _id = button.getAttribute('event_button_id');
      const response = await delete_data(`manage_events/remove_event?_id=${_id}`);
      if(response.message === 'event deleted') {
        button.parentElement.parentElement.remove();
      }
    });
  });
}

function form_state() {
  const form = document.querySelector('#search_form');
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  if(data.event_name.trim() === '' && data.location.trim() === '' && data.date.trim() === '') {
    document.querySelector('#search_result').innerText = '';
  }
}

document.querySelector('#search_by_name').addEventListener('input', form_state);