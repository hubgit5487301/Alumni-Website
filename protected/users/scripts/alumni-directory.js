import { API_BASE_URL } from "../../protected-scripts/config.js";
import { yearSelect, getdataonevent as getdata } from "../../protected-scripts/util.js";
yearSelect('.search-input-year');

async function getnewusers (page) {
  const data = await getdata(`/users?page=${page}&limit=20`);
  return data;
}

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formdata = new FormData(e.target);
});


let current_page = 1;
const data = await getdata(`/users?page=${current_page}&limit=20`);



function render_users(data) {
data.forEach(user => {
  const list = document.createElement('li');
  const image = document.createElement('img');
  const name = document.createElement('p');
  image.src = user.personimage;
  name.innerText = user.personname;
  list.append(image, name);
  list.setAttribute('userid', user.userid);
  list.classList.add('button-id');
  document.querySelector('.users').append(list);
  if(user.usertype === 'alumni') {
    list.style.backgroundColor = 'rgba(255, 0, 0, 0.445)';
  }
});

const user_button = document.querySelectorAll('.button-id')
  user_button.forEach(button => {
  button.addEventListener('click', (e) => {
    const userid = button.getAttribute('userid');
    window.location.href = `profile?userid=${userid}`
  })
});
}
render_users(data);

const lastlistobserver = new IntersectionObserver(async (entries) => {
    const lastentry = entries[0];
    if(!lastentry.isIntersecting) return;
    // const data = await getdata(`/users?page=2&limit=20`);
    const data = await getnewusers(current_page + 1);
    if(data.length === 0) return;
    render_users(data);
    current_page++;
    lastlistobserver.unobserve(lastentry.target);
    lastlistobserver.observe(document.querySelector('.button-id:last-child'));
},{
  rootMargin: '100px'
});
const button = document.querySelector('.button-id:last-child')
lastlistobserver.observe(button);

// let loading = false;

// window.addEventListener('scroll', async () => {
//   if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
//     if(loading) return;
//     loading = true;
//     try{
//       const data = await getdata(`/users?page=${current_page + 1}&limit=10`);
//       if(data.length === 0) {
//         console.log('No more data to load');
//         return;
//       }
//       render_users(data);
//       current_page++;
//     }
//     catch(err) {
//       console.error(err);
//       alert('There was an error fetching the data');
//     }
//     finally {
//       loading = false;
//     }
//   }
// })
// if (document.documentElement.scrollHeight <= window.innerHeight) {
//   // simulate scroll to load the data on larger screens
//   window.dispatchEvent(new Event('scroll'));
// }

// if (document.documentElement.scrollHeight <= window.innerHeight) {
//   // simulate scroll to load the data on larger screens
//   window.dispatchEvent(new Event('scroll'));
// }
// yearSelect('.js-search-input-year');


// let personHtml = '';

// fetch(`${API_BASE_URL}/protected/users`)
//   .then(response => {
//     if(!response.ok) {
//       throw new Error('response not ok');
//     }
//     return response.json();
//   })     
//   .then(data => {
//     personHtml = '';
//     data.forEach((user, index) => {
//     personHtml +=`
//         <div class="person js-person">
//             <img class="person-image" src="${user.personimage}"  loading="lazy">
//             <div class="person-name js-person-name" id="${user.userid}">
//               <h>${user.personname}</h>
//             </div>
//         </div>
// `   })

//     document.querySelector('.js-person-row').innerHTML = personHtml;
//     data.forEach(user => {
//       const personback = document.getElementById(user.userid);
//       if(user.usertype) {
//         if(user.usertype === 'alumni') {
//           personback.style.backgroundColor = 'rgba(255, 0, 0, 0.59)';
//         }
//         else if(user.usertype === 'student') {
//           personback.style.backgroundColor = 'rgba(43, 167, 221, 0.59)';
//         }
//       }
//       else {
//         personback.style.backgroundColor = 'rgba(46, 45, 45, 0.596)';
//       }
//     })
//     document.querySelectorAll('.js-person').forEach((user, index) => {
//           user.addEventListener('click' ,() => {
//             const userid = data[index].userid;
//             window.location.href = `profile?userid=${userid}`;
//           });
//         });
//   })
//   .catch(err => {
//     console.log(err);
//   })

// let debounce = '';

// const result = document.querySelector('.js-search-output');
// const searchButton = document.querySelector('.js-search-button');
// let searchHtml = '';
// searchButton.addEventListener('click', () =>{
//   const textinput = document.querySelector('.js-search-input').value.trim();
//   const batchinput = document.querySelector('.js-search-input-year').value;
//   const branchinput = document.querySelector('.js-search-input-branch').value;

//   const query = new  URLSearchParams({
//     personname: textinput,
//     batch: batchinput, 
//     branch: branchinput
//   });


//   clearTimeout(debounce);

//   debounce = setTimeout(() => {
//     if (!textinput && !batchinput && !branchinput) {
//       result.innerHTML = `<div class="text-1 js-text-1">Please provide at least one search parameter.</div>`;
//       result.classList.add('show');
//       return;
//     }
    
//   fetch(`${API_BASE_URL}/protected/alumni-search?${query}`)
//   .then(response => {
//     if(!response.ok) {
//       throw new Error('response not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     if(data.length === 0) {
//       result.innerHTML = `<div class="text-1 js-text-1">No user found</div> `;
//       result.classList.add('show');
//           return;
//    }
//     searchHtml = '';
//     data.forEach(user =>{
//       searchHtml +=`
//         <div class="person-1 js-person-1">
//             <img class="person-image-1" src="${user.personimage}"  loading="lazy">
//             <div class="person-name" id="${user.userid}">
//               <h>${user.personname}</h>
//             </div>
//         </div>
// ` 
//     })    
//       result.innerHTML = searchHtml;
      
//       result.classList.add('show');

//       setTimeout(() => {
//           document.querySelectorAll('.js-person-1').forEach((person, index) => {
//             person.classList.add('show'); 
//           });
//         }, 10);
//         data.forEach(user => {
//           const personback = document.getElementById(`${user.userid}`);
//           if(user.usertype) {
//             if(user.usertype === 'alumni') {
//               personback.style.backgroundColor = 'rgba(255, 0, 0, 0.59)';
//             }
//             else if(user.usertype === 'student') {
//               personback.style.backgroundColor = 'rgba(43, 167, 221, 0.59)';
//             }
//           }
//           else {
//             personback.style.backgroundColor = 'rgba(46, 45, 45, 0.596)';
//           }
//         })
//       document.querySelectorAll('.js-person-1').forEach((user, index) => {
//         user.addEventListener('click' ,() => {
//           const userid = data[index].userid;
//           window.location.href = `profile?userid=${userid}`;
//         });
//       });
//     })

// .catch(err=> {
//   console.error('error fetching data',err);
//   result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
// })
// })
// }, 250)



