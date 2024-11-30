let personHtml = '';

fetch(`http://localhost:8000/protected/users`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })     
  .then(data => {
    data.forEach((user) => {
    personHtml +=`
        <div class="person js-person">
            <img class="person-image" src="${user.personimage}">
            <div class="person-name">
              <h>${user.personname}</h>
            </div>
        </div>
`

document.querySelector('.js-person-row').innerHTML = personHtml;
document.querySelectorAll('.js-person').forEach((user, index) => {
      user.addEventListener('click' ,() => {
        const userid = data[index].userid;
        window.location.href = `profile.html?userid=${userid}`;
      });
    });
  });});

const searchInput = document.querySelector('.js-search-input');
const result = document.querySelector('.js-search-output');

let searchHtml = '';
searchInput.addEventListener('input', () =>{
  const input = document.querySelector('.js-search-input').value.trim();
  if(input.trim() === '') {
    result.innerHTML = '';
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
    data.forEach(user =>
      searchHtml +=`
        <div class="person js-person">
            <img class="person-image" src="${user.personimage}">
            <div class="person-name">
              <h>${user.personname}</h>
            </div>
        </div>
`     )
      result.innerHTML = searchHtml;
})
  .catch(err=> {
    console.error('error fetching data',err);
    result.innerHTML = '<div>There was an error fetching the data</div>';
  })
 
})