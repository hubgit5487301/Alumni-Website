import {upload as uploadfile, getdataonevent as getdata, updatedataonevent as updatedata,uploaddataonevent as uploaddata, download as downloadresume} from "../../protected-scripts/util.js";

const data = await getdata('/my-profile');

if(data.usertype === 'alumni' || data.usertype === 'admin') {
  const posts = document.querySelector('.my-posts');
  posts.style.display = 'block';
  posts.href = `/protected/myprofile-posts`;
}

if (data.personimage.toLowerCase() === 'empty') document.querySelector('.profile-pic').src = '/images/blank_profile_pic.png';
else document.querySelector('.profile-pic').src = data.personimage;  

document.querySelector('.user-name').textContent = data.personname;

document.querySelector('.batch').textContent = `Batch: ${data.details.batch}`;
document.querySelector('.branch').textContent = `Branch: ${data.details.branch}`;

document.querySelector('.my-applications').href = `/protected/myprofile-appli`;

const imagesallowed = ['image/jpeg', 'image/png'];

document.querySelector('.edit-profile-pic').addEventListener('click', () => {
  document.querySelector('.input-image').click();

  uploadfile('.input-image', imagesallowed, async (file64) => {
    const data = ({
      file64
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
      const file = response.result.details.resume;
      // const filetype = 'application/pdf';
      // downloadresume(file64, filetype, `${response.result.personname} Resume.pdf`);}
      if (file) {
        try {
          let base64String = file;
          if (base64String.startsWith('data:')) {
            base64String = base64String.split(',')[1];
          }
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          window.open(blobUrl, '_blank');
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
          console.error('Failed to open PDF:', error);
          alert('Invalid file data, please try later.');
        }
      } else {
        alert('An error has occurred, please try later');
      }
    // else if(data.error === 'File not found') {
    //   alert('No file was found')
    }
});

