document.querySelector('.js-login-button').addEventListener('click', (event) => {
  event.preventDefault();
  const userid = document.querySelector('.js-userid-box').value;
  const password = document.querySelector('.js-password-box').value;
  const logindata = {
    userid: userid,
    password: password,
  }
  
fetch(`http://localhost:8000/login`, {
  method: 'POST',
  headers:{
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(logindata),

})
.then((response) => {
  

  if(!response.ok) {
    return response.json().then((data) => {
      throw new Error(data.message);
    });
  }
  return response.json();
  })
.then((data) => {
  alert(data.message);
  window.location.href = '/dashboard';
  console.log('login successful')
  })
.catch((error) => {
  alert(error.message);
  console.log('Error',error);
})

})