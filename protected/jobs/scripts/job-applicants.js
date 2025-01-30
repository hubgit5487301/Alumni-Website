import { formatjobdate , getdataonevent as get_data, download as resume_download} from "../../protected-scripts/util.js";

const urlParam = new URLSearchParams(window.location.search);
const job_id = urlParam.get('_id');

const data = await get_data(`applicants/posted_job?job_id=${job_id}`);
const {job_data, applicants_data} = data;
const applicants_Data = applicants_data.applicants;

document.querySelector('main section>section').style.backgroundImage = `url(${job_data.job_company_logo})`;

document.querySelector('#tittle').innerText = job_data.job_tittle;
document.querySelector('#job_name').innerText = job_data.job_tittle;
document.querySelector('#company_name').innerText = job_data.job_company_name;
document.querySelector('#salary').innerText = "Salary: "+job_data.job_salary + " Rs";
document.querySelector('#job_type').innerText = "Job Type: "+job_data.job_type;
document.querySelector('#app_email').innerText = "Email: "+job_data.job_app_email;
document.querySelector('#job_level').innerText = "Job Level: "+job_data.job_level;
document.querySelector('#deadline').innerText = "Deadline: "+formatjobdate(job_data.job_deadline);
document.querySelector('#location').innerText = "Location: "+job_data.job_location;
document.querySelector('#education').innerText = job_data.job_edu;
document.querySelector('#experience').innerText = job_data.job_exp_level + " Years";
document.querySelector('#job_description').innerText = job_data.job_des;

applicants_Data.forEach(async (applicant) => {
  const user_data = await get_data(`user/user_data?userid=${applicant.applicant}`);
  const tr = document.createElement('tr');
  tr.id = 'applicant_cell';
  tr.setAttribute('userid', user_data.userid);
  const name = document.createElement('td');
  name.innerText = user_data.personname;
  const batch = document.createElement('td');
  batch.innerText = user_data.details.batch + `-${parseInt(user_data.details.batch)+4}`;
  const role = document.createElement('td');
  role.innerText = user_data.details.currentrole;
  const education = document.createElement('td');
  education.innerText = user_data.details.education;
  const download = document.createElement('td');
  const download_button = document.createElement('button');
  download_button.innerText = "Download Resume";
  download.append(download_button);
  tr.append(name, batch, education, role, download);
  document.querySelector('#applicants').append(tr);

  tr.addEventListener('click', async (e) => {
    if(e.target.tagName === 'BUTTON') {
      return;
    }
    const userid = e.currentTarget.getAttribute('userid');
    window.location.href = `/protected/profile?userid=${userid}`;
  });

  download_button.addEventListener('click', async (e) => {
    const response = await get_data(`applicant/resume_download?userid=${user_data.userid}`);
    const file = response.file.details.resume;
    resume_download(file,'application/pdf',`${user_data.personname}_resume`);
  })
})

document.querySelector('#download_as_list').addEventListener('click', async () => {
  const table = document.querySelector('#applicants_table');
  let table_data = [];
  const header_row = table.querySelector('thead tr');
  const header_cells = Array.from(header_row.children).slice(0, -1)
  const header_data = header_cells.map(cell => cell.innerText);
  table_data.push(header_data);
  
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const row_data = Array.from(row.cells).slice(0, -1).map(cell => cell.innerText);
    table_data.push(row_data);
  })

  const select = document.querySelector('#download_as');
  const select_value = select.value;
  if(select_value === 'xlsx') {
    const ws = XLSX.utils.aoa_to_sheet(table_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    XLSX.writeFile(wb, `${job_data.job_tittle}_applicants.xlsx`);
  }
  else if(select_value === 'csv') {
    const csv = table_data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job_data.job_tittle}_applicants.csv`;
    a.click();
  }
  else if(select_value === 'txt') {
    const txtContent = table_data.map(row => row.join('\t')).join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${job_data.job_tittle}_applicants.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else if(select_value === 'pdf') {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({head: [header_data], body: table_data.slice(1)});
    doc.save(`${job_data.job_tittle}_applicants.pdf`);
  }
  else if(select_value === 'json') {
    const jsonData = table_data.slice(1).map(row => {
      let obj = {};
      row.forEach((cell, index) => {
        obj[header_data[index]] = cell;
      });
      return obj;
    });
    const jsonString = JSON.stringify(jsonData, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${job_data.job_tittle}_applicants.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else if(select_value === 'xml') {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<applicants>\n';

    table_data.slice(1).forEach(row => {
      xmlContent += '  <applicant>\n';
      row.forEach((cell, index) => {
        xmlContent += `    <${header_data[index]}>${cell}</${header_data[index]}>\n`;
      });
      xmlContent += '  </applicant>\n';
    });
    xmlContent += '</applicants>';
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${job_data.job_tittle}_applicants.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
})