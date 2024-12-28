document.querySelector('nav').innerHTML = `
  <li><a href="/dashboard"><img src="/images/logo.webp">Alumni-Portal</a></li>
  <li class="hideonmobile"><a href="/dashboard">Dashboard</a></li>
  <li class="hideonmobile"><a href="/services">Services</a></li>
  <li class="hideonmobile"><a href="/protected/alumni-directory">Users</a></li>
  <li class="hideonmobile"><a href="/protected/event-directory">Events</a></li>
  <li class="hideonmobile"><a href="/protected/job-directory">Jobs</a></li>
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
