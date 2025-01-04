import { API_BASE_URL } from "./config.js";

export async function getdataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/protected/${address}`);
    if(!response.ok) {
      throw new Error('response not ok');
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    console.log(err)
    throw err;
  }    
}

export async function uploaddataonevent (address, data) {
  try{
    const response = await fetch(`${API_BASE_URL}/${address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // if(!response.ok) {
    //   throw new Error('response not ok');
    // }
    if (!response.ok) {
      // Try to parse the error response as JSON if possible
      let errorDetails = '';
      try {
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const errorResponse = await response.json(); // Parse JSON error
          errorDetails = errorResponse.message || JSON.stringify(errorResponse);
        } else {
          errorDetails = await response.text(); // Fallback to plain text/HTML
        }
      } catch {
        errorDetails = response.statusText || 'Unknown error occurred';
      }

      throw new Error(`Server error (${response.status}): ${errorDetails}`);
    }
    const datarecieve = await response.json();
    return datarecieve;
  }
  catch(err) {
    console.log(err.message);
    throw err;
  }    
}

export function passwordMatchcheck (password, renterpassword){
  if (password != renterpassword)
  { 
    alert("Passwords do not match!");
    return false;
  }
  return true;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function inputCheck(fields) {
  let inputcheck = false;

  fields.forEach(({ value, selector }) => {
    if (!value) {
      inputcheck = true;
    } 
  });
  return inputcheck;
}


export function isValidUserid(userid) {
  const useridregex = /^(98|99|[0-9]{2})(CSE|ME|CE|EE|ECE)(0[1-9]|[1-9][0-9])$/;
  return useridregex.test(userid);
}

export function upload (input,allowed,value,name, callback) {
  document.querySelector(input).addEventListener('change', (event) => {
    const filename = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
    const file =event.target.files[0];
    if (file) {
      
      if (!allowed.includes(file.type)) {
        alert('invalid file ');
        return;
      }
    }
    if(value)
    {
      document.querySelector(name).innerHTML = file.name;
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

export function formatEventDate(eventdate) {
  const date = new Date(eventdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}, ${hours}:${minutes}`;
}


export const stopLoading = () => {
  document.body.classList.remove('loading');
  document.querySelector('.loading-page').style.opacity = 0;
  setTimeout(() => {
    document.querySelector('.loading-page').style.display = 'none';
  },500)
};