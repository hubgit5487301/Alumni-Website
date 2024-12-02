import {getdataonevent as getusertype} from "./util.js";




document.querySelector('.js-post-job').addEventListener('click',async () => {
  let usertype = '';
  try{
    const data = await  getusertype('my-usertype');
    usertype = data.usertype;
  }
  catch(err) {
    console.log(err)
  }

  if(usertype === 'alumni') {
    window.location.href = '/protected/job-form';
  }
  else if(usertype !== 'student' || '') {
    alert("Sorry only alumni are allowed to post requests for jobs");
  }
})