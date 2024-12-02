let personHtml = '';

fetch(`http://localhost:8000/protected/users`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })     
  .then(data => {
    personHtml = '';
    data.forEach((user, index) => {
    personHtml +=`
        <div class="person js-person">
            <img class="person-image" src="${user.personimage}">
            <div class="person-name js-person-name" id="${user.userid}">
              <h>${user.personname}</h>
            </div>
        </div>
`   })

    document.querySelector('.js-person-row').innerHTML = personHtml;
    data.forEach(user => {
      const personback = document.getElementById(user.userid);
      if(user.usertype) {
        if(user.usertype === 'alumni') {
          personback.style.backgroundColor = 'rgba(255, 0, 0, 0.59)';
        }
        else if(user.usertype === 'student') {
          personback.style.backgroundColor = 'rgba(43, 167, 221, 0.59)';
        }
      }
      else {
        personback.style.backgroundColor = 'rgba(46, 45, 45, 0.596)';
      }
    })
    document.querySelectorAll('.js-person').forEach((user, index) => {
          user.addEventListener('click' ,() => {
            const userid = data[index].userid;
            window.location.href = `profile.html?userid=${userid}`;
          });
        });
  ;});

const searchInput = document.querySelector('.js-search-input');
const result = document.querySelector('.js-search-output');

let searchHtml = '';
searchInput.addEventListener('input', () =>{
  const input = document.querySelector('.js-search-input').value.trim();
  let debounce = '';
  clearTimeout(debounce);

  debounce = setTimeout(() => {
    if(input.trim() === '') {
      result.innerHTML = '';
      result.style.display = 'none';
    }
    else {
      result.style.display = 'grid';
    }
    fetch(`http://localhost:8000/protected/alumni-search?name=${encodeURIComponent(input)}`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })
  .then(data => {
    searchHtml = '';
    if(data.length === 0) {
        result.classList.add('show');
        result.innerHTML = `<div class="text js-text">No user with name "${input}" found</div> `;
        document.querySelector('.js-text').classList.add('show');
     }
    data.forEach(user =>{
      searchHtml +=`
        <div class="person js-person">
            <img class="person-image" src="${user.personimage}">
            <div class="person-name">
              <h>${user.personname}</h>
            </div>
        </div>
`     
      result.innerHTML = searchHtml;
      setTimeout(() => {
        document.querySelectorAll('.js-person').forEach(person => {
          person.classList.add('show');
        });
      }, 10);
      result.classList.add('show');
      document.querySelectorAll('.js-person').forEach((user, index) => {
        user.addEventListener('click' ,() => {
          const userid = data[index].userid;
          window.location.href = `profile.html?userid=${userid}`;
        });
      });
    })
})
  .catch(err=> {
    console.error('error fetching data',err);
    result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
  })
 
}, 250)})

