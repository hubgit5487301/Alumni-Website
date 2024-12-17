import {search } from './util.js'

const search_button = document.querySelector('.js-search-button');
search_button.addEventListener('click', () => {
  search('.js-search-username','.js-search-userid','/search_users');
})