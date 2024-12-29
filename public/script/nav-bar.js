/*document.querySelector('nav').innerHTML = `
  <li><a href="/dashboard"><img src="/images/logo.webp">Alumni-Portal</a></li>
  <li class="hideonmobile"><a href="/dashboard">Dashboard</a></li>
  <li class="hideonmobile"><a href="/services">Services</a></li>
  <li class="hideonmobile"><a href="/protected/alumni-directory">Users</a></li>
  <li class="hideonmobile"><a href="/protected/event-directory">Events</a></li>
  <li class="hideonmobile"><a href="/protected/job-directory">Jobs</a></li>
  <li class="hideonmobile"><a href="/contact-us">Contact-Us</a></li>
  <li class="login"><a href="/login">Login</a></li>
  <li class="hideonmobile sign-up"><a href="/registration-form">SignUp</a></li>
  <li class="menu-button"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
`;

document.querySelector('aside').innerHTML = `
    <li><a href="/dashboard"><img src="/images/logo.webp"></a></li>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/protected/services">Services</a></li>
    <li><a href="/protected/alumni-directory">Users</a></li>
    <li><a href="/protected/event-directory">Events</a></li>
    <li><a href="/protected/job-directory">Jobs</a></li>
    <li><a href="/contact-us">Contact-Us</a></li>
    <li class="close-button"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>`

document.querySelector('footer').innerHTML = `
      <li><a href="#">Copyright <span>&#169;</span> 2024</a></li>
      <div>
        <li><a href="http://www.linkedin.com/company/ietagra/?originalSubdomain=in"><img src="/images/linkedin.svg"></a></li>
        <li><a href="http://www.instagram.com/iet_khandari_agra_official/"><img src="/images/instagram.svg"></a></li>
        <li><a href="http://www.facebook.com/IETDBRAUAGRA/"><img src="/images/facebook.svg"></a></li></div>
      <li><a href="#">Terms | Privacy Policy</a></li>
    `


document.querySelector('.menu-button').addEventListener('click', () => {
  document.querySelector('aside').style.display = 'block';
})

document.querySelector('.close-button').addEventListener('click', ()=> {
  document.querySelector('aside').style.display = 'none'
})
*/


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
  createNavLink('/contact-us', 'Contact Us', 'hideonmobile', null),
  createNavLink('/login', 'Login', 'login', null),
  createNavLink('/registration-form', 'SignUp', 'hideonmobile sign-up', null),
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
  createNavLink('/contact-us', 'Contact Us', null, null),
  createNavLink('/registration-form', 'SignUp', 'hideonmobile sign-up', null),
  createNavLink('#', null, 'close-button', '/images/close.svg')
)


let footer_copyright = document.createElement('li');
let logo_div = document.createElement('div');
let footer_terms = document.createElement('li');

let footer_div_linkedin = document.createElement('li');
let footer_div_instagram = document.createElement('li');
let footer_div_facebook = document.createElement('li');

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
  document.querySelector('aside').style.display = 'block';
})

document.querySelector('.close-button').addEventListener('click', ()=> {
  document.querySelector('aside').style.display = 'none'
})
