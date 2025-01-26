import { formatEventDate, getdataonevent as get_data, download as download_event_file ,button_disable} from "../../protected-scripts/util.js";

const urlParams = new URLSearchParams(window.location.search);
const event_id = urlParams.get('_id');

const response = await get_data(`events/${event_id}`);
const check = await get_data(`event_application_check/?event_id=${event_id}`);

document.querySelector('#tittle').innerText = response.name;

document.querySelector('#event_image').src= response.event_logo;
document.querySelector('#event_name').innerText = response.name;
document.querySelector('#event_date').innerText = `Date & Time: ${formatEventDate(response.date)}`;

const applyButton = document.querySelector('#apply');
if(check.message.toLowerCase().trim() === 'already applied') {
  
  applyButton.innerText = 'Already Applied';
  button_disable(applyButton);
}
applyButton.addEventListener('click', async () => {
  const response = await get_data(`apply_event/?event_id=${event_id}`);
  if(response.message === 'Applied to event') {
    alert(response.message);
    applyButton.innerText = 'Already Applied';
    button_disable(applyButton);
  }
})

const download_button = document.querySelector('#download_event_details');
if(response.event_file === 'no file') {
  button_disable(download_button);
}

download_button.addEventListener('click', async () => {
  const data = await get_data(`event-file/${event_id}`)
  if(data.error) {
    alert(data.error)
  }
  else {
    download_event_file(data, 'application/pdf', response.name)
  }
})

document.querySelector('#event_description').innerText = response.event_des;
document.querySelector('#event_location').innerText = response.location;
document.querySelector('#event_phone_no').innerText = response.contact_info.phone_no;
document.querySelector('#event_email').innerText = response.contact_info.email;