import { stopLoading } from "../scripts/util.js";

document.body.classList.add("loading");
document.addEventListener("DOMContentLoaded", async () => {
  setInterval(() => {  stopLoading();}, 200);
});

function create_item( name, link, d, id) {
  const view_box = "0 -960 960 960";
  const li = document.createElement('li');
  if(id !== '') li.id = id;
  
  const a = document.createElement('a');
  a.href = link;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', view_box);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);

  const p = document.createElement('p');
  if(name !== '') p.innerText = name;
  li.append(a);
  a.append(svg);
  svg.append(path);
  a.append(p);
  return li;  
}


document.querySelector('body>nav').append(
  create_item('', '#', "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z", 'open'),
  create_item('Home', '/admin', "M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z", ''),
  create_item('Users', '/admin/manage_users', "M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z", ''),
  create_item('Events', "/admin/manage_events", "M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z", ''), 
  create_item('Jobs', "/admin/manage_jobs", "M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm0-80h640v-440H160v440Zm240-520h160v-80H400v80ZM160-200v-440 440Z", ''),
  create_item('Email Blast', '#', "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z", ''),
  create_item('Logout', '#', "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z", 'logout')
);



console.log(document.querySelectorAll('body>nav>li'));

let menu_check = false;
document.querySelector('#open').addEventListener('click', () => {
  const screen_width = window.matchMedia('(max-width: 450px)');
  if(menu_check === false && !screen_width.matches) {
    document.querySelector('body>nav').style.width = "300px";
    document.querySelectorAll('body>nav>li').forEach((li) =>{li.style.width = "100%"});
    document.querySelectorAll('body nav li a p').forEach(p => {p.style.display = "block";});
    menu_check = true;
  }

  else if(menu_check === false && screen_width.matches) {
    document.querySelector('body>nav').style.width = "100vw";
    document.querySelector('body>nav').style.left = "0";
    document.querySelector('body>nav').style.borderRadius = "0";
    document.querySelector('body>nav').style.height = "100vh";
    document.querySelectorAll('body>nav>li').forEach((li) =>{li.style.width = "100%"});
    document.querySelectorAll('body nav li a p').forEach(p => {p.style.display = "block";});
    menu_check = true;
  }

  else if(menu_check === true) {
    document.querySelector('body>nav').style.width = "70px";
    document.querySelector('body>nav').style.height = "99vh";
    document.querySelector('body>nav').style.left = "5px";
    document.querySelector('body>nav').style.borderRadius = "1em";
    document.querySelectorAll('body>nav>li').forEach((li) =>{li.style.width = "50px"})
    document.querySelectorAll('body nav li a p').forEach(p => {p.style.display = "none";});
    menu_check = false;
  }
});

document.querySelector('#logout').addEventListener('click', async () => {
  window.location.href = '/logout';
});