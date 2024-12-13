import {getdataonevent as getdata, download as download_notes} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search);
const branch = urlParams.get('branch');
document.querySelector('.top-heading').innerHTML = `${branch} Notes`


const data = await getdata(`notes/${branch}&Notes`);

load_content(data, 1, '.js-content-1');
load_content(data, 2, '.js-content-2');
load_content(data, 3, '.js-content-3');
load_content(data, 4, '.js-content-4');
load_content(data, 5, '.js-content-5');
load_content(data, 6, '.js-content-6');
load_content(data, 7, '.js-content-7');
load_content(data, 8, '.js-content-8');

function load_content(data, sem, content) {
  let file_html = '';
  const file_selector = document.querySelector(content);
  const filtered_data = data.filter(item => item.semester === sem);
  if(filtered_data.length >0) {
    filtered_data.forEach(data => {
        file_html += `<div class="file js-file" id="${data._id}">${data.name}</div>`;
      })  
      file_selector.innerHTML = file_html;
      const file_button = file_selector.querySelectorAll('.js-file');
      file_button.forEach(async file_button => {
        file_button.addEventListener('click', async () => {
          const _id = file_button.getAttribute('id');
          const file64 = await getdata(`notes/download/${_id}`);
          download_notes(file64.file, 'application/pdf', file64.name)
        })
      })
      
    }
    else {
      file_selector.innerHTML = `<div class="no-file">No files found</div>`;
    }   
}
