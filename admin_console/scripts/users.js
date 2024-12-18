import {search, getdataonevent as getdata, deletedataonevent as deletedata, updatedataonevent as patchdata} from './util.js'

const list_users = document.querySelector('.js-list-users');

const all_users = await getdata('users');


if(all_users.length === 0) {
  list_users.innerHTML = `<div class="text-info">No users found</div>`
}
else if(all_users.length > 0) {
  let userHtml = '';
  all_users.forEach(user => {
    userHtml += `
    <div class="data js-user-data" user-id="${user.userid}">
      <img class="image" src="${user.personimage}">
      <div class="name">${user.userid}
      </div>
      <div class="name">${user.personname}
      </div>
      <div class="name">${user.usertype}
      </div>
    </div>
    <div class="set-admin js-set-admin" user-admin="${user.userid}">Make Admin</div>
    <div class="revoke-button js-remove-button" remove-button="${user.userid}">Remove</div>`    
  });
  list_users.innerHTML = userHtml;

  

      
  const search_button = document.querySelector('.js-search-button');
  search_button.addEventListener('click', () => {
    search('.js-search-username','.js-search-userid','/search_users');
  })
  const search_username = document.querySelector('.js-search-username');

  search_username.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search('.js-search-username','.js-search-userid','/search_users').then(()=> {setuser()})
    }
  })

  const search_userid = document.querySelector('.js-search-userid');

  search_userid.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search('.js-search-username','.js-search-userid','/search_users').then(()=> {setuser()});
    }
  })
  setuser();
}



function setuser() {

  const user_button = document.querySelectorAll('.js-user-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const userid = button.getAttribute('user-id');
      window.location.href = `/protected/profile?userid=${userid}`
    })
  })
  const set_admin = document.querySelectorAll('.js-set-admin');
  set_admin.forEach(button => {
    button.addEventListener('click',async () => {
      const userResponse = confirm('Are you sure you want to set user as an admin')
      if(userResponse) {
        const userid = button.getAttribute('user-admin')
        const data = await patchdata(`set_admin?userid=${userid}`);
        if(data.message === 'made admin') {
          const userelement = document.querySelector(`.data.js-user-data[user-id="${userid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${userid}"]`);
          const adminelemet = document.querySelector(`.set-admin.js-set-admin[user-admin="${userid}"]`)
          if(userelement) userelement.remove();
          if(removeelement) removeelement.remove();
          if(adminelemet) adminelemet.remove();
          if(list_users.innerHTML.trim() === ''){
            list_users.innerHTML = '<div class="text-info">No users found</div>' }
        }
      }
    })
  })
  const remove_button = document.querySelectorAll('.js-remove-button');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm('Delete User')
      if(userResponse) {
        const userid = button.getAttribute('remove-button');
        const data = await deletedata(`remove_user?userid=${userid}`, '');
        if(data.message === 'user deleted') {
          const userelement = document.querySelector(`.data.js-user-data[user-id="${userid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${userid}"]`);
          if(userelement) userelement.remove();
          if(removeelement) removeelement.remove();
          if(list_users.innerHTML.trim() === ''){
            list_users.innerHTML = '<div class="text-info">No users found</div>' }
        }
      }
    })
  })
}