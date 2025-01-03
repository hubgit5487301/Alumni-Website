import {getdataonevent as getdata} from "../../protected-scripts/util.js";

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');
const data = await getdata(`/users/${userid}`);

document.querySelector('.profile-pic').src = data.personimage;
document.querySelector('.user-name').textContent = data.personname;
document.querySelector('.batch').textContent = `Batch: ${data.details.batch}`;
document.querySelector('.branch').textContent = `Branch: ${data.details.branch}`;
document.querySelector('.about-me').innerText = data.details.aboutme;
document.querySelector('.education').innerText = data.details.education;
document.querySelector('.role').innerText = data.details.currentrole;
document.querySelector('.experience').innerText = data.details.experience;
document.querySelector('.contact-info ').innerText = data.details.contactinfo;

