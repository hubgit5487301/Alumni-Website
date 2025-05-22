import { getdataonevent as get_data, formatEventDate} from "../../protected-scripts/util.js";

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const query = Object.fromEntries(form_data.entries());
  if (!Array.from(form_data.values()).some(value => value.trim() !== '')) {
    alert('Form is empty! Please fill out at least one field.');
    return;
  }
  const query_string = new URLSearchParams(query).toString();
  const response = await get_data(`event_search?${query_string}`);
  if(response.length === 0) return;
  if(response.length !== 0) { 
    document.querySelector('.events').replaceChildren();
    document.querySelector('.events').style.gridTemplateColumns = "repeat(auto-fit, minmax(clamp(170px, 20%, 250px), 1fr))";
    render_events(response);
  }
});

const name = document.querySelector('#name');
const date = document.querySelector('#date');

async function form_state() {
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  if(data.name === '' && data.date === '') {
    document.querySelector('.events').innerText = '';
    document.querySelector('.events').style.gridTemplateColumns = "repeat(auto-fit, minmax(clamp(170px, 20%, 250px), 1fr))";
    load_events();
  }
}

name.addEventListener('input', form_state);
date.addEventListener('change', form_state);

async function get_new_events(page) {
  return await get_data(`events?page=${page}&limit=10`);
}

async function load_events() {
    let current_page = 1;
    let loading = false;
    const data = await get_data(`/events?page=${current_page}&limit=10`);
    render_events(data);
  
    const lastlistobserver = new IntersectionObserver(async (entries) => {
        const lastentry = entries[0];
        if(!lastentry.isIntersecting || loading) return;
        loading = true;
        const data = await get_new_events(current_page + 1);
        if(data.length === 0) {
          loading = false;
          return;
        }
        render_events(data);
        current_page++;
        lastlistobserver.unobserve(lastentry.target);
        lastlistobserver.observe(document.querySelector('.event:last-child'));
        loading = false;
    },{
      rootMargin: '100px'
    });
    const list = document.querySelector('.event:last-child');
    if (list) lastlistobserver.observe(list);
}

function render_events(data) {
  const event_window = document.querySelector('.events');
  data.forEach(event => {
    const li = document.createElement('li');
    const image = document.createElement('img');
    const section = document.createElement('section');
    const name = document.createElement('p');
    const date = document.createElement('p');
    name.id = 'name';
    date.id = 'date';
    section.append(name,date);
    li.append(image,section);
    li.setAttribute('event_id', event._id);
    li.classList.add('event');
    image.src = event.event_logo;
    name.innerText = event.name;
    console.log(event.date)
    date.innerText = formatEventDate(event.date);
    event_window.append(li);
  });
  const event_button = document.querySelectorAll('.event');
  event_button.forEach(button => {
    button.addEventListener('click', () => {
      const event_id = button.getAttribute('event_id');
      window.location.href = `event?_id=${event_id}`;
    });
  });
}

load_events();