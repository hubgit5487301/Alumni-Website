import {getdataonevent as get_data, deletedataonevent as delete_data, updatedataonevent as patch_data, yearSelect as batch_year, } from './util.js'

document.querySelector('.active').classList.remove('active');
document.querySelector('nav>li:nth-child(2)').classList.add('active');
batch_year('#search_by_year');

const {admins, alumni, students} = await get_data('users');

const all_admin = document.querySelector('#all_admin_button');
const all_alumni = document.querySelector('#all_alumni_button');
const all_students = document.querySelector('#all_students_button');

const admin_table = document.querySelector('#all_admin>tbody');
const alumni_table = document.querySelector('#all_alumni>tbody');
const student_table = document.querySelector('#all_students>tbody');

function create_table(data, table, user_type) {
  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerText = 'No users found';
    td.colSpan = 7;
    td.style.textAlign = 'center';
    tr.append(td);
    table.append(tr);
    return;
  }
  data.forEach(user => {
    const user_id_td = document.createElement('td');
    user_id_td.innerText = user.userid;

    const user_name_td = document.createElement('td');
    user_name_td.innerText = user.personname;
    
    const email_td = document.createElement('td');
    email_td.innerText = user.email;

    const branch_td = document.createElement('td');
    branch_td.innerText = user.details.branch;
    
    const batch_td = document.createElement('td');
    batch_td.innerText = user.details.batch + '-' + (parseInt(user.details.batch)+4);

    const user_verification_td = document.createElement('td');
    if(user.verified)user_verification_td.innerText = 'Verified';
    else user_verification_td.innerText = 'Not Verified';

    const action_button = document.createElement('select');
    const option1 = document.createElement('option');
    option1.value = '';
    option1.innerText = 'Select Action';
    const option2 = document.createElement('option');
    option2.value = 'verify';
    option2.innerText = 'Verify';
    const option3 = document.createElement('option');
    option3.value = 'remove';
    option3.innerText = 'Remove';
    const option4 = document.createElement('option');
    option4.value = 'admin';
    option4.innerText = 'Make Admin';
    const option5 = document.createElement('option');
    option5.innerText = 'Revoke Admin';
    option5.value = 'revoke';
    action_button.setAttribute('data-userid', user.userid);
    action_button.id = `action_button_${user.userid}`;
    action_button.classList.add(`action_button_${user.usertype}`);
    const button_label = document.createElement('label');
    button_label.innerText = '';
    button_label.htmlFor = `action_button_${user.userid}`;
    if (user.usertype === 'alumni' || user.usertype === 'student') 
      {
        if(user.verified) action_button.append(option1, option3, option4);
        else action_button.append(option1, option2, option3);
      }
    else if (user.usertype === 'admin') action_button.append(option1, option5);
    const action_button_td = document.createElement('td');
    action_button_td.append(button_label);
    action_button_td.append(action_button);

    const tr = document.createElement('tr');
    tr.append( user_id_td, user_name_td, email_td, branch_td, batch_td, user_verification_td, action_button_td);
    tr.setAttribute('data-userid', user.userid);
    tr.id = `user_${user.usertype}`;
    table.append(tr);
  });
  document.querySelectorAll(`#user_${user_type}`).forEach(user_tr => {
    user_tr.addEventListener('click', async (e) => {
      if(e.target.tagName === 'SELECT') return;
      const user_id = user_tr.getAttribute('data-userid');
      window.location.href = `/protected/profile?userid=${user_id}`;
    })
  })
  document.querySelectorAll(`.action_button_${user_type}`).forEach(action_button => {
    action_button.addEventListener('change', async (e) => {
      const user_id = action_button.getAttribute('data-userid');
      const action = e.target.value;
      if(action === 'verify') {
        const response = await patch_data(`manage_users/verify_user?userid=${user_id}`);
        if(response.message.toLowerCase() === 'account verified') {
          action_button.parentElement.parentElement.querySelector('td:nth-child(6)').innerText = 'Verified';
          const option4 = document.createElement('option');
          option4.value = 'admin';
          option4.innerText = 'Make Admin';
          action_button.append(option4);
          action_button.querySelector('option[value="verify"]').remove();
        }
      }
      else if(action === 'admin') {
        let confirmation = confirm('Are you sure you want to make this user an admin?');
        if(!confirmation) return;
        const response = await patch_data(`manage_users/set_admin?userid=${user_id}`);
        if (response.message.toLowerCase() === 'admin added') {
          if(admins.length === 0) admin_table.innerHTML = '';
          all_admin.click();
          action_button.innerText = '';
          const option1 = document.createElement('option');
          option1.value = '';
          option1.innerText = 'Select Action';
          const option5 = document.createElement('option');
          option5.innerText = 'Revoke Admin';
          option5.value = 'revoke';
          action_button.append(option1, option5);
          admin_table.append(action_button.parentElement.parentElement);  
        }
      }
      else if(action === 'remove') {
        let confirmation =  confirm('Are you sure you want to remove this user?');
        if(!confirmation) {
          action_button.value = '';
          return;
        }
        const response = await delete_data(`manage_users/remove_user?userid=${user_id}`);
        if(response.message.toLowerCase() === 'user deleted') {
          action_button.parentElement.parentElement.remove();
        }
      }
      else if(action === 'revoke') {
        let confirmation = confirm('Are you sure you want to revoke admin access?');
        if(!confirmation) {
          action_button.value = '';
          return;
        }
        const response = await patch_data(`manage_users/revoke_admin?userid=${user_id}`);
        if(response.message.toLowerCase() === 'admin rights revoked') {
          document.querySelector(`#all_${response.usertype}_button`).click();
          action_button.innerText = '';
          const option1 = document.createElement('option');
          option1.value = '';
          option1.innerText = 'Select Action';
          const option3 = document.createElement('option');
          option3.value = 'remove';
          option3.innerText = 'Remove';
          const option4 = document.createElement('option');
          option4.value = 'admin';
          option4.innerText = 'Make Admin';
          action_button.append(option1, option3, option4);
          document.querySelector(`#all_${response.usertype}>tbody`).append(action_button.parentElement.parentElement);
          if(admin_table.children.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = 'No users found';
            td.colSpan = 7;
            td.style.textAlign = 'center';
            tr.append(td);
            admin_table.append(tr);
          }
        }
      }
    })
  });
}


create_table(alumni, alumni_table, 'alumni');
create_table(students, student_table, 'student');
create_table(admins, admin_table, 'admin');


const table_container = document.querySelector('#all_users');
const show_table = (table, button_id) => {
  table_container.style.transform = `translateX(-${table * 33.3}%)`;
  document.querySelector('.button_active').classList.remove('button_active')
  document.getElementById(button_id).classList.add('button_active');
}

all_alumni.addEventListener('click', () => {show_table(0, 'all_alumni_button')});
all_students.addEventListener('click', () => {show_table(1, 'all_students_button')});
all_admin.addEventListener('click', () => {show_table(2, 'all_admin_button');})

const form = document.querySelector('#search_form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form_data = new FormData(form);
  const search_data = Object.fromEntries(form_data.entries());
  if (!Array.from(form_data.values()).some(value => value.trim() !== '')) {
    alert('Please enter search criteria');
    return;
  }
  const response = await get_data(`manage_users/search_users?${new URLSearchParams(search_data).toString()}`);
  const result = document.querySelector('#search_result')
  create_search_table(response, result, '');
})

function create_search_table( data, table) {
  {
    table.innerText = '';
    if (data.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.innerText = 'No users found';
      td.colSpan = 7;
      td.style.textAlign = 'center';
      tr.append(td);
      table.append(tr);
      return;
    }
    data.forEach(user => {
      const user_id_td = document.createElement('td');
      user_id_td.innerText = user.userid;
      
      const user_name_td = document.createElement('td');
      user_name_td.innerText = user.personname;
      
      const email_td = document.createElement('td');
      email_td.innerText = user.email;
      
      const user_type_td = document.createElement('td');
      user_type_td.innerText = user.usertype;

      const branch_td = document.createElement('td');
      branch_td.innerText = user.details.branch;
      
      const batch_td = document.createElement('td');
      batch_td.innerText = user.details.batch + '-' + (parseInt(user.details.batch)+4);
  
      const user_verification_td = document.createElement('td');
      if(user.verified)user_verification_td.innerText = 'Verified';
      else user_verification_td.innerText = 'Not Verified';
  
      const action_button = document.createElement('select');
      const option1 = document.createElement('option');
      option1.value = '';
      option1.innerText = 'Select Action';
      const option2 = document.createElement('option');
      option2.value = 'verify';
      option2.innerText = 'Verify';
      const option3 = document.createElement('option');
      option3.value = 'remove';
      option3.innerText = 'Remove';
      const option4 = document.createElement('option');
      option4.value = 'admin';
      option4.innerText = 'Make Admin';
      const option5 = document.createElement('option');
      option5.innerText = 'Revoke Admin';
      option5.value = 'revoke';
      action_button.setAttribute('data-userid', user.userid);
      action_button.id = `search_action_button_${user.userid}`;
      action_button.classList.add(`search_action_button_${user.usertype}`);
      const button_label = document.createElement('label');
      button_label.innerText = '';
      button_label.htmlFor = `search_action_button_${user.userid}`;
      if (user.usertype === 'alumni' || user.usertype === 'student') 
        {
          if(user.verified) action_button.append(option1, option3, option4);
          else action_button.append(option1, option2, option3);
        }
      else if (user.usertype === 'admin') action_button.append(option1, option5);
      const action_button_td = document.createElement('td');
      action_button_td.append(button_label);
      action_button_td.append(action_button);
  
      const tr = document.createElement('tr');
      tr.append( user_id_td, user_name_td, email_td, branch_td, batch_td, user_verification_td, user_type_td, action_button_td);
      tr.setAttribute('data-userid', user.userid);
      tr.id = `search_user_${user.usertype}`;
      if(user.usertype === 'alumni') tr.classList.add('search_alumni');
      else if(user.usertype === 'student') tr.classList.add('search_student');
      else if(user.usertype === 'admin') tr.classList.add('search_admin');
      table.append(tr);
    });

    document.querySelectorAll('#search_user_alumni, #search_user_admin, #search_user_student').forEach(user_tr => {
      user_tr.addEventListener('click', async (e) => {
        if(e.target.tagName === 'SELECT') return;
        const user_id = user_tr.getAttribute('data-userid');
        window.location.href = `/protected/profile?userid=${user_id}`;
      })
    })
    document.querySelectorAll('.search_action_button_alumni, .search_action_button_admin, .search_action_button_student').forEach(action_button => {
      action_button.addEventListener('change', async (e) => {
        const user_id = action_button.getAttribute('data-userid');
        const action = e.target.value;
        if(action === 'verify') {
          const response = await patch_data(`manage_users/verify_user?userid=${user_id}`);
          if(response.message.toLowerCase() === 'account verified') {
            action_button.parentElement.parentElement.querySelector('td:nth-child(6)').innerText = 'Verified';
            const option4 = document.createElement('option');
            option4.value = 'admin';
            option4.innerText = 'Make Admin';
            action_button.append(option4);
            action_button.querySelector('option[value="verify"]').remove();
          }
        }
        else if(action === 'admin') {
          let confirmation = confirm('Are you sure you want to make this user an admin?');
          if(!confirmation) {
            action_button.value = '';
            return;
          }
          const response = await patch_data(`manage_users/set_admin?userid=${user_id}`);
          if (response.message.toLowerCase() === 'admin added') {
            if(admins.length === 0) admin_table.innerHTML = '';
            action_button.innerText = '';
            const option1 = document.createElement('option');
            option1.value = '';
            option1.innerText = 'Select Action';
            const option5 = document.createElement('option');
            option5.innerText = 'Revoke Admin';
            option5.value = 'revoke';
            action_button.append(option1, option5);
            action_button.parentElement.parentElement.classList.add('search_admin');  
          }
        }
        else if(action === 'remove') {
          // let confirmation =  confirm('Are you sure you want to remove this user?');
          // if(!confirmation) {
          //   action_button.value = '';
          //   return;
          // }
          const response = await delete_data(`manage_users/remove_user?userid=${user_id}`);
          if(response.message.toLowerCase() === 'user deleted') {
            action_button.parentElement.parentElement.remove();
          }
        }
        else if(action === 'revoke') {
          let confirmation = confirm('Are you sure you want to revoke admin access?');
          if(!confirmation) {
            action_button.value = '';
            return;
          }
          const response = await patch_data(`manage_users/revoke_admin?userid=${user_id}`);
          if(response.message.toLowerCase() === 'admin rights revoked') {
            action_button.innerText = '';
            const option1 = document.createElement('option');
            option1.value = '';
            option1.innerText = 'Select Action';
            const option3 = document.createElement('option');
            option3.value = 'remove';
            option3.innerText = 'Remove';
            const option4 = document.createElement('option');
            option4.value = 'admin';
            option4.innerText = 'Make Admin';
            action_button.append(option1, option3, option4);
            action_button.parentElement.parentElement.classList.remove('search_admin');
            action_button.parentElement.parentElement.classList.add(`search_${response.usertype}`);
          }
        }
      })
    });
  }
}

function form_state() {
  const form = document.querySelector('#search_form');
  const form_data = new FormData(form);
  const data = Object.fromEntries(form_data.entries());
  if(data.personname.trim() === '' && data.userid.trim() === '' && data.batch.trim() === ''&& data.branch.trim() === '') {
    document.querySelector('#search_result').innerText = '';
    return;
  }
}

document.querySelector('#search_by_name').addEventListener('input', form_state);
document.querySelector('#search_by_userid').addEventListener('input', form_state);
document.querySelector('#search_by_year').addEventListener('change', form_state);
document.querySelector('#search_by_branch').addEventListener('change', form_state);