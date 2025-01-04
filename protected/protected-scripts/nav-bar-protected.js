import { getdataonevent as getdata, stopLoading } from "./util.js";
document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("loading");});

let imageCache = {};
const preloadImages = async (imageUrls) => {
  for (const url of imageUrls) {
    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });

      imageCache[url] = img; 
    } catch (error) {
      console.error(error.message); 
    }
  }
}

const imageUrls = [
  "/images/logo.webp",
  "/images/menu.svg",
  "/images/close.svg",
  "/images/linkedin.svg",
  "/images/instagram.svg",
  "/images/facebook.svg",
];

const user_logo = await getdata("/user_logo");
if (user_logo) imageUrls.push(user_logo); 


await preloadImages(imageUrls);
stopLoading();

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("alert");
if (urlParams.has("alert")) {
  if (message === "logout-first") {
    alert("Please logout first.");
  }
}

function createNavLink(url, text, classname, imageUrl) {
  const li = document.createElement("li");
  if (classname) classname.split(" ").forEach((cls) => li.classList.add(cls));
  const link = document.createElement("a");
  link.href = url;
  if (imageUrl) {
    const img = imageCache[imageUrl] ? imageCache[imageUrl].cloneNode(true) : new Image();;
    img.src = imageUrl;
    link.append(img);
    // console.log(link);
  }
  if (text) {
    const textnode = document.createTextNode(text);
    link.append(textnode);
  }

  li.append(link);
  return li;
}

const nav = document.querySelector('nav');
nav.append(
  createNavLink('/admin', 'Alumni-Portal', null, "/images/logo.webp"),
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

