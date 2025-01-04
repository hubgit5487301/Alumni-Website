import { base64convert as eventdataupload, isValidEmail, getdataonevent as get_data, uploaddataonevent as new_event } from "../../protected-scripts/util.js";

const allowedpic =['image/jpeg','image/png'];
const allowedfile ='application/pdf';
let eventimage = '';
let eventfile = '';
document.querySelector('#event_file').addEventListener('input', (e) => {
  const file = e.target.files[0];
  eventdataupload(allowedfile, file, (file64) => {
    eventfile = file64;
  })
});

document.querySelector('#event_logo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  eventdataupload(allowedpic, file, (file64) => {
    eventimage = file64});
});


document.querySelector('.submit').addEventListener('click', async (e) => {
  e.preventDefault();
  const form = e.target.closest('form');
  const formdata = new FormData(form);
  const event_data = Object.fromEntries(formdata.entries());
  // console.log([...formdata.keys()])
  const email = event_data['email'];
  let input_check = false;
  Object.keys(event_data).forEach(element => {
    if (event_data[element] === '') {
      input_check = true;
    return;      
    }
  })
  if(input_check) {alert('Please fill all required fields'); return;}
  if(!isValidEmail(email)) {
    alert('Enter a valid email');
    return;
  }
  const contact_info = ({email, phone_no: event_data['phone_no']});
  const req_data = event_data;
  delete req_data.event_file;
  delete req_data.event_logo;
  delete req_data.email;
  delete req_data.phone_no;
  Object.assign(req_data, {eventfile, eventimage, contact_info});
  console.log(req_data);
  const response = await new_event('submit-event', req_data);
  console.log(response);
  if(response.message === 'Data submitted') {
    alert('Form submitted successfully!');
    window.location.href = '/protected/event-directory';
  }
});
