import { API_BASE_URL } from "./config.js";

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function inputCheck(fields) {
  let inputcheck = false;

  fields.forEach(({ value, selector }) => {
    const field = document.querySelector(selector);
    if (!value) {
      inputcheck = true;
    } else {
    }
  });
  return inputcheck;
}

export function isValidUserid(userid) {
  const useridregex = /^(98|99|[0-9]{2})(CSE|ME|CE|EE|ECE)(0[1-9]|[1-9][0-9])$/
  return useridregex.test(userid);
}

export function base64convert (allowed, file, callback) {
  if (!allowed.includes(file.type)) {
    alert(`invalid file type please provide file of type ${allowed}`);
    return;
  }

if (file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    const file64 = reader.result;
    if (callback) callback(file64);
    }
  }
}

export function upload (input, allowed, callback) {
  document.querySelector(input).addEventListener('change', (event) => {
    const file =event.target.files[0];
    if (file) {
      if (!allowed.includes(file.type)) {
        alert(`invalid file type please provide file of type ${allowed}`);
        return;
      }
    }
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const file64 = reader.result;
        if (callback) callback(file64);
      }
    }
})}


export function download(base64, mimeType, fileName) {
  const base64Data = base64.startsWith('data:') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data); 
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i); 
    }
    byteArrays.push(new Uint8Array(byteNumbers)); 
  }
  const blob = new Blob(byteArrays, { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName; 
  link.click();  
}

export function formatEventDate(eventdate) {
  const date = new Date(eventdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}`;
}

export function formatjobdate(jobdate) {
  const date = new Date(jobdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}`;
}

export async function getdataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/protected/${address}`);
    
    if(!response.ok) {
      const errorResponse = await response.json(); 
      alert(errorResponse.message || 'Something went wrong'); 
      throw new Error(errorResponse.message || `Error ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    console.log(err)
    throw err;
  }    
}


export async function deletedataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/protected/${address}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      const errorResponse = await response.json(); 
      alert(errorResponse.message || 'Something went wrong'); 
      throw new Error(errorResponse.message || `Error ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    throw err;
  }    
}

export async function updatedataonevent (address, data) {
  try{
    const response = await fetch(`${API_BASE_URL}/protected/${address}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if(!response.ok) {
      const errorResponse = await response.json(); 
      alert(errorResponse.message || 'Something went wrong'); 
      throw new Error(errorResponse.message || `Error ${response.status}`);
    }
    const datarecieve = await response.json();
    return datarecieve;
  }
  catch(err) {
    throw err;
  }    
}

export async function uploaddataonevent (address, data) {
  try{
    const response = await fetch(`${API_BASE_URL}/protected/${address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if(!response.ok) {
      const errorResponse = await response.json(); 
      alert(errorResponse.message || 'Something went wrong'); 
      throw new Error(errorResponse.message || `Error ${response.status}`);
    }
    const datarecieve = await response.json();
    return datarecieve;
  }
  catch(err) {
    throw err;
  }    
}

export function yearSelect (input) {
  const startYear = 1998;
  const endYear = (new Date().getFullYear()) + 4;
  const yearSelect = document.querySelector(input);
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
};


export async function download_search_file(file_button, address) {
  file_button.forEach(file_button => {
        file_button.addEventListener('click', async () => {
          const _id = file_button.getAttribute('id');
          const file64 = await getdataonevent(`${address}/${_id}`);
          download(file64.file, 'application/pdf', file64.name)
        })
      })
}

export async function search(type, input1, input2, input3, address, branch) {
  const name = document.querySelector(input1).value;
  const semester= document.querySelector(input2).value;
  const subject= document.querySelector(input3).value;
  let search_html = '';
  const query = new URLSearchParams({
      name, semester, subject, type: type, branch:branch
    });
  const search_result = document.querySelector('.js-search-output');
  if(!name && !semester && !subject) {
    search_result.style.justifyItems= 'center';
    search_html += `<div class="no-input">Please provide at least one parameter</div>`
    search_result.innerHTML = search_html;
    return;
  }
  const search_data = await getdataonevent(`${address}?${query}`);
  if(search_data.length > 0) {
  search_data.forEach(data => {
    search_html += `<div class="file js-file" id="${data._id}"><div>${data.name}</div></div>`
  });}
  else {
    search_html += `<div class="no-input">No file found with provided parameters</div>`
  }
  search_result.innerHTML = search_html;
  const file_button = document.querySelectorAll('.js-file');
  download_search_file(file_button, 'resources/download');
}

export const stopLoading = () => {
  document.body.classList.remove('loading');
  document.querySelector('.loading-page').style.opacity = 0;
  setTimeout(() => {
    document.querySelector('.loading-page').style.display = 'none';
  },500)
};

export function button_disable(button) {
  button.disabled = true;
  button.style.opacity = 0.5;
  button.style.cursor = 'not-allowed';
  button.style.backgroundColor = 'var(--blue)';
  button.style.color = 'white';
}

export function create_element() {
  const li = document.createElement('li');
  const p = document.createElement('p');
  const img = document.createElement('div');
  const button = document.createElement('button');
  button.innerText = 'Remove';
  li.append(img, p , button);
  return li;
}
