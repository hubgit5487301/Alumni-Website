import {upload as uploadfile, getdataonevent as getdata, updatedataonevent as updatedata,updloaddataonevent as uploaddata, download as downloadresume} from "../../protected-scripts/util.js";

const data = await getdata('/my-profile');

if(data.usertype === 'alumni' || data.usertype === 'admin') {
  const posts = document.querySelector('.my-posts');
  posts.style.display = 'block';
  posts.href = `/protected/myprofile-posts/?userid=${data.userid}`;
}
  
document.querySelector('.profile-pic').src = data.personimage;
document.querySelector('.user-name').textContent = data.personname;

document.querySelector('.batch').textContent = `Batch: ${data.details.batch}`;
document.querySelector('.branch').textContent = `Branch: ${data.details.branch}`;

document.querySelector('.my-applications').href = `/protected/myprofile-appli/?userid=${data.userid}`;

const userid = data.userid;
const imagesallowed = ['image/jpeg', 'image/png'];

document.querySelector('.edit-profile-pic').addEventListener('click', () => {
  document.querySelector('.input-image').click();

  uploadfile('.input-image', imagesallowed, async (file64) => {
    const data = ({
      file64, userid
    })
    const response = await updatedata('my-profile/edit-profile-pic', data);
    if(response.message === 'Profile picture changed') {
      alert(response.message);
      const user_pic = await getdata('/user_logo');
      document.querySelector('.profile-pic').src = user_pic;
      document.querySelector('.profile_pic').querySelector('a').querySelector('img').src = user_pic;
    }
    else {
          alert('An error has occured please try later')
        }
  });
});

document.querySelector('.about-me').innerText = data.details.aboutme;
document.querySelector('.education').innerText = data.details.education;
document.querySelector('.role').innerText = data.details.currentrole;
document.querySelector('.experience').innerText = data.details.experience;
document.querySelector('.contact-info ').innerText = data.details.contactinfo;

document.querySelector('.js-edit-user-details').addEventListener('click', () => {
    window.location.href = `my-profile/edit_profile_info`;
})

document.querySelector('.upload-resume').addEventListener('click', async () => {
  const fileallowed = ['application/pdf']
      uploadfile('.upload-resume', fileallowed, async (file64) => {
        const data = ({file64});
        const response = await uploaddata('my-profile/upload-resume', data);
        if(response.message === 'Resume Uploaded') {
          alert(response.message);
        }
        else if(response.error) {
          alert(response.error);
        }
  });
});

document.querySelector('.download-resume').addEventListener('click', async () => {
  const response = await getdata('my-profile/download-resume');
  
    if(response.message === 'File Found') {
      const file64 = response.result.details.resume;
      const filetype = 'application/pdf';
      downloadresume(file64, filetype, `${response.result.personname} Resume.pdf`);}
    else if(data.error === 'File not found') {
      alert('No file was found')
    }
});

