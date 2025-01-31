import {getdataonevent as getdata, download as download_notes} from '../../protected-scripts/util.js';


const form = document.querySelector('form');

form.addEventListener('submit',async (e) => {
  e.preventDefault();
  
  const input = form.querySelectorAll('input, select' );
  let is_form_empty = true;
  input.forEach(input => {
    if(input.value.trim() !== '') {
      is_form_empty = false;
    }
  });
  if(is_form_empty) {
    alert('Please Provide at least one search parameter');
    return;
  }

  const form_data = new FormData(form);
  const query = Object.fromEntries(form_data.entries());
  query.type = 'Notes';
  const query_string = new URLSearchParams(query).toString();
  const response = await getdata(`resources_search?${query_string}`);
  if(response.length === 0) {
    alert('No files found with provided parameters');
    return;
  }
  if(response.length !== 0) {
    const search_result = document.querySelector('main>section');
    search_result.innerText = '';
    search_result.style.display = 'flex';
    search_result.style.flexWrap = 'wrap';
    search_result.style.justifyContent = 'space-around';
    response.forEach(item => {
      const div = document.createElement('div');
      const p = document.createElement('p');
      const download_button = document.createElement('button');
      download_button.innerText = 'Download';
      div.classList.add('search-result');
      download_button.classList.add('download-button');
      download_button.setAttribute('data-id', item._id);
      p.innerText = item.name;
      div.append(p, download_button);
      div.style.width = '100%';
      p.style.width = '100%';
      search_result.append(div);
    });
    download_file();
  }
})

const response = await getdata(`resources/&Notes`);

function load_content(response){
  const main_section = document.querySelector('main>section');
  main_section.innerText = '';
  main_section.style.display = 'grid';
  const semesters = [1,2,3,4,5,6,7,8];
  semesters.forEach(semester => {
    const section = document.createElement('section');
    const h1 = document.createElement('h1');
    h1.innerText = `Semester ${semester}`;
    const inner_section = document.createElement('section');
    inner_section.id = `sem-${semester}`;
    inner_section.innerText = 'No Files Found';
    section.style.gridArea = `box-${semester}`;
    section.append(h1, inner_section);
    document.querySelector('main>section').append(section);
  })
  response.forEach(item => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const download_button = document.createElement('button');
    download_button.innerText = 'Download';
    div.append(p, download_button);
    const sem = document.querySelector(`#sem-${item.semester}`);
    if(sem.innerText.toLowerCase() === 'no files found') sem.innerText = '';
    p.innerText = item.name;
    download_button.classList.add('download-button');
    download_button.setAttribute('data-id', item._id);
    sem.append(div.cloneNode(true));
  });
  download_file();
}

function download_file() {
  document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const _id = e.target.getAttribute('data-id')
      const file = await getdata(`resources/download/${_id}`);
      if(file) download_notes(file.file, 'application/pdf', file.name);
      else alert('An error has occurred please try later');
    })
  });
}

function formState() {
  const form_data = new FormData(document.querySelector('form'));
  const data = Object.fromEntries(form_data.entries());
  if(data.name === '' && data.semester === '' && data.subject === '') {
    load_content(response);
  }
}

document.querySelector('#file_name').addEventListener('input', formState);
document.querySelector('#semester').addEventListener('change', formState);
document.querySelector('#subject').addEventListener('change', formState);

load_content(response);