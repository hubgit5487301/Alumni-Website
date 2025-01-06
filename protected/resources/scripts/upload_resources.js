import { base64convert as resource_file, uploaddataonevent as upload_resource } from "../../protected-scripts/util.js";

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const file_type = document.querySelector('#file_type');
let new_type = '';
if(type) {
  if (type === 'notes') {
    file_type.value = 'Notes';
    new_type = 'Notes'; 
  }
  else {
    file_type.value = 'qpapers';
    new_type = 'qpapers';
  }
  file_type.disabled = true;
  file_type.style.display = 'none';
  document.querySelector(`label[for="${file_type.id}"]`).style.display = 'none'
}

let file = undefined;
const allowed_files = 'application/pdf'

document.querySelector('#file').addEventListener('input', (e) => {
  const temp_file = e.target.files[0];
  document.querySelector('label[for="file"').innerText = temp_file.name;
  resource_file(allowed_files, temp_file, (file64) => {
    file = file64;
  })
})

const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.group(file_type.value);
  const form_data = new FormData(form);
  const resource_data = Object.fromEntries(form_data.entries());
  if(type) resource_data.file_type = new_type; 
  delete resource_data.file;
  resource_data.file = file;
  const response = await upload_resource('submit_resource' ,resource_data);
  if(response.message.toLowerCase() === 'file uploaded') {
    alert(response.message);
    document.querySelector('label[for="file"').innerText = 'Upload File'
    form.reset();
  }
})