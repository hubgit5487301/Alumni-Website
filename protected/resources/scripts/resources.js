import { getdataonevent as getdata } from "../../protected-scripts/util.js";

const data = await getdata('my-usertype');

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', ()=> {
    const id = button.getAttribute('id');
    const type = id.split(" ")[1];
    const branch = id.split(" ")[0];
    if(branch === 'upload_resources') {
      if(data.usertype === 'admin') window.location.href = `/protected/upload_resources?type=${type}`;
      else alert('You are not authorized for this action')
    }
    else {
      window.location.href = `/protected/${type}/?branch=${branch}`;
    }
  })
})