import {stopLoading } from "./util.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("loading");
});

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

await preloadImages(imageUrls);
stopLoading();

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
  createNavLink('#', 'Alumni-Portal', null, "/images/logo.webp"),
  createNavLink('/contact-us', 'Help', 'help', null),
  createNavLink('/login', 'Login', 'login', null),
  createNavLink('/registration-form', 'SignUp', 'sign-up', null),
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
