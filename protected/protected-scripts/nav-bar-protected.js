import { getdataonevent as getdata } from "./util.js"


document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('loading'); 

  const stopLoading = () => {
    document.body.classList.remove('loading');
    document.querySelector('.loading-page').style.opacity = 0;
    setTimeout(() => {
      document.querySelector('.loading-page').style.display = 'none';
    },800)
  };

  window.addEventListener('load', () => {
    setTimeout(stopLoading, 800); 
  });
});
  
let user_logo = await getdata('/user_logo');

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('alert');
if(urlParams.has('alert')) {
  if(message === 'logout-first') {
    alert('Please logout first. ');
  }
}

function createNavLink( url, text, classname, image) {
  const li = document.createElement('li');
  if(classname) classname.split(' ').forEach(cls => li.classList.add(cls));

  const link = document.createElement('a');

  link.href = url;

  const img = document.createElement('img');
  if(image) {
    img.src = image;
    link.append(img);
  }

  if(text) {
    const textnode = document.createTextNode(text)
    link.appendChild(textnode);
  }
  
  li.append(link);
  return li;
}

const nav = document.querySelector('nav');

nav.append(
  createNavLink('/dashboard', 'Alumni-Portal', null, "/images/logo.webp"),
  createNavLink('/dashboard', 'Dashboard', 'hideonmobile', null),
  createNavLink('/services', 'Services', 'hideonmobile', null),
  createNavLink('/protected/alumni-directory', 'Users', 'hideonmobile', null),
  createNavLink('/protected/event-directory', 'Events', 'hideonmobile', null),
  createNavLink('/protected/job-directory', 'Jobs', 'hideonmobile', null),
  createNavLink('/protected/contact-us', 'Help', 'hideonmobile', null),
  createNavLink('/protected/my-profile-page', null, 'profile_pic', user_logo ),
  createNavLink('/logout', 'Logout', 'login', null),
  createNavLink('#', null, 'menu-button', '/images/menu.svg')
)

const aside = document.querySelector('aside');

aside.append(
  createNavLink('/dashboard', null , null, "/images/logo.webp"),
  createNavLink('/dashboard', 'Dashboard', null, null),
  createNavLink('/services', 'Services', null, null),
  createNavLink('/protected/alumni-directory', 'Users', null, null),
  createNavLink('/protected/event-directory', 'Events', null, null),
  createNavLink('/protected/job-directory', 'Jobs', null, null),
  createNavLink('/protected/contact-us', 'Help', 'help', null),
  createNavLink('#', null, 'close-button', '/images/close.svg')
)



const footer = document.querySelector('footer');
footer.append(createNavLink('#', 'Copyright', null, null));

const div = document.createElement('div');
div.classList.add('footer_logo');
footer.append(div);

const footer_div = document.querySelector('.footer_logo');
footer_div.append(
  createNavLink('http://www.linkedin.com/company/ietagra/?originalSubdomain=in', null, null, '/images/linkedin.svg'),
  createNavLink('http://www.instagram.com/iet_khandari_agra_official/', null, null, '/images/instagram.svg'),
  createNavLink('http://www.facebook.com/IETDBRAUAGRA/"><img src="/images/facebook.svg', null, null, '/images/facebook.svg')
)

footer.append(createNavLink('#', 'Terms | Privacy Policy', null, null))



document.querySelector('.menu-button').addEventListener('click', () => {
  
document.querySelector('aside').style.transform = 'translateX(0%)';
})

document.querySelector('.close-button').addEventListener('click', ()=> {
  document.querySelector('aside').style.transform = 'translateX(100%)';
})