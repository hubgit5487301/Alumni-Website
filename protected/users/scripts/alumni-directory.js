import { yearSelect, getdataonevent as getdata } from "../../protected-scripts/util.js";
yearSelect('.search-input-year');

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formdata = new FormData(e.target);
  const data = Object.fromEntries(formdata.entries());
  if (!Array.from(formdata.values()).some(value => value.trim() !== '')) {
    alert('Form is empty! Please fill out at least one field.');
    return;
  }
  const query = new URLSearchParams({
    personname: data.user,
    batch: data.batch,
    branch: data.branch
  })
  const users = await getdata(`/alumni-search?${query}`);
  if(users.length === 0) {
    alert('No user found');
    return;
  }
  else if(users.length > 0) {
    document.querySelector('.users').replaceChildren();
    render_users(users);
  }
});

const input_Element = document.querySelector('input');
const year_Element = document.querySelector('.search-input-year');
const branch_Element = document.querySelector('.search-input-branch');

input_Element.addEventListener('input', formState);
branch_Element.addEventListener('change', formState);
year_Element.addEventListener('change', formState);

async function formState() {
  const formdata = new FormData (document.querySelector('form'));
  const data = Object.fromEntries(formdata.entries());
  
  if(data.batch === '' && data.branch === '' && data.user === '') {
    document.querySelector('.users').innerText = '';
    load_users();
  }
}

async function load_users() {
  let current_page = 1;
  let loading = false;
  const data = await getdata(`/users?page=${current_page}&limit=20`);
  render_users(data);

  const lastlistobserver = new IntersectionObserver(async (entries) => {
      const lastentry = entries[0];
      if(!lastentry.isIntersecting || loading) return;
      loading = true;
      const data = await getnewusers(current_page + 1);
      if(data.length === 0) {
        loading = false;
        return;
      }
      render_users(data);
      current_page++;
      lastlistobserver.unobserve(lastentry.target);
      lastlistobserver.observe(document.querySelector('.button-id:last-child'));
      loading = false;
  },{
    rootMargin: '100px'
  });
  const list = document.querySelector('.button-id:last-child')
  if (list) lastlistobserver.observe(list);
}

function render_users(data) {
  const userlist = document.querySelector('.users');
  const fragment = new DocumentFragment();
  data.forEach(user => {
    const list = document.createElement('li');
    const image = document.createElement('img');
    const name = document.createElement('p');
    if(user.personimage === 'Empty') image.src = '/images/blank_profile_pic.png';
    else image.src = user.personimage;
    name.innerText = user.personname;
    list.append(image, name);
    list.setAttribute('userid', user.userid);
    list.classList.add('button-id');
    if(user.usertype === 'alumni') {
      list.style.backgroundColor = 'rgba(255, 0, 0, 0.445)';
    }

    fragment.append(list);
  });
  userlist.append(fragment);
  const user_button = document.querySelectorAll('.button-id')
    user_button.forEach(button => {
    button.addEventListener('click', (e) => {
      const userid = button.getAttribute('userid');
      window.location.href = `profile?userid=${userid}`
    })
  });
  }

async function getnewusers (page) {
  const data = await getdata(`/users?page=${page}&limit=20`);
  return data;
}




load_users();
