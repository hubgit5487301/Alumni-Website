let personHtml = '';

fetch(`http://localhost:8000/protected/users`,)
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