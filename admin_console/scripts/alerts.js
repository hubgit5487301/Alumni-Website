import {uploaddataonevent as send_emails} from '../scripts/util.js';

document.querySelector('.active').classList.remove('active');
document.querySelector('nav>li:nth-child(5)').classList.add('active');

const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  const response = await send_emails('alerts', data);
  if(response.status === 200) {
    alert('Emails sent successfully');
    form.reset();
  }
})