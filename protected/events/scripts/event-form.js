import { base64convert as eventdataupload, isValidEmail, getdataonevent as get_data, uploaddataonevent as new_event } from "../../protected-scripts/util.js";

const allowedpic =['image/jpeg','image/png'];
const allowedfile ='application/pdf';
let event_logo = '';
let event_file = '';
document.querySelector('#event_file').addEventListener('input', (e) => {
  const file = e.target.files[0];
  document.querySelector('label[for="event_file"]').innerText = e.target.files[0].name;
  eventdataupload(allowedfile, file, (file64) => {
    event_file = file64;
  })
});

document.querySelector('#event_logo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  document.querySelector('label[for="event_logo"]').innerText = e.target.files[0].name;
  eventdataupload(allowedpic, file, (file64) => {
    event_logo = file64});
});


document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target.closest('form');
  const formdata = new FormData(form);
  const event_data = Object.fromEntries(formdata.entries());
  Object.keys(event_data).forEach(element => {
    if (event_data[element] === '') {
      input_check = true;
    return;      
    }
  })

  const contact_info = ({email: event_data['email'], phone_no: event_data['phone_no']});
  const req_data = event_data;
  delete req_data.event_file;
  delete req_data.event_logo;
  delete req_data.email;
  delete req_data.phone_no;
  Object.assign(req_data, {event_file, event_logo, contact_info});
  const response = await new_event('submit-event', req_data);
  if(response.message.toLowerCase() === 'data submitted') {
    alert('Form submitted successfully!');
    window.location.href = '/protected/event-directory';
  }
});