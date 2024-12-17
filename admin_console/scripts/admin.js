import {getdataonevent as getdata} from './util.js';



const total_users = document.querySelector('.js-users-stats');
const active_users = document.querySelector('.js-active-users-stats');
const total_events = document.querySelector('.js-events-stats');
const today_events = document.querySelector('.js-today-events-stats')
const total_jobs = document.querySelector('.js-jobs-stats');
const today_jobs= document.querySelector('.js-today-job-stats');

const data = await getdata('get_stats');

total_users.innerHTML = `Total Users: ${data.total_users}`;
total_events.innerHTML = `Total Events: ${data.total_events}`;
total_jobs.innerHTML = `Total Jobs: ${data.total_jobs}`;

active_users.innerHTML = `Active Users: ${data.active_users}`;
today_events.innerHTML = `Events posted today: ${data.today_events}`;
today_jobs.innerHTML = `Jobs posted today: ${data.today_jobs}`;