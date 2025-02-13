import {getdataonevent as get_data, deletedataonevent as delete_data, updatedataonevent as patch_data, yearSelect as batch_year, } from './util.js'

document.querySelector('.active').classList.remove('active');
document.querySelector('nav>li:nth-child(3)').classList.add('active');