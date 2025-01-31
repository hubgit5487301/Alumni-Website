import {getdataonevent as getusertype} from "./util.js";

const data = await  getusertype('my-usertype');
let usertype = '';
try{
  usertype = data.usertype;
}
catch(err) {
  console.log(err)
}
document.querySelector('.js-post-job').addEventListener('click',async () => {

  if(usertype === 'alumni' || usertype ===  'admin' || usertype === 'temp_admin') {
    window.location.href = '/protected/job-form';
  }
  else {
    alert("Sorry only alumni are allowed to post requests for jobs");
  }
})


document.querySelector('.js-post-event').addEventListener('click', async () =>{
  let usertype = '';
  try{
    const data = await getusertype('my-usertype');
    usertype = data.usertype; 
  }
  catch(err) {
    console.log(err);
  }


  if(usertype === 'admin' || usertype === 'temp_admin') {
    window.location.href = '/protected/event-form';
  }
  else {
    alert("Sorry only admins are allowed to post requests for events");
  }
})

document.querySelector('#notes').addEventListener('click', () => {
  window.location.href = "/protected/notes"
})

document.querySelector('#upload_resources').addEventListener('click', () => {
  if(usertype === 'admin' || usertype === 'temp_admin') {
    window.location.href = "/protected/upload_resources"
  }
  else {
    alert('You are not authorized for this action')
  }
})

document.querySelector('#papers').addEventListener('click', () => {
  window.location.href = "/protected/paper"
})