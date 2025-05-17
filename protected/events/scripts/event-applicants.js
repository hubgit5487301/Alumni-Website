import { formatEventDate , getdataonevent as get_data, button_disable} from "../../protected-scripts/util.js";

const urlParam = new URLSearchParams(window.location.search);
const event_id = urlParam.get('_id');

const data = await get_data(`applicants/posted_event?event_id=${event_id}`);
const {event_data, applicants_Data} = data;
const applicants_data = applicants_Data.applicants;

const table_body = document.querySelector('#applicants');

applicants_data.forEach(async (applicant) => {
  const user_data = await get_data(`user/user_data_event?userid=${applicant.applicant}`);
  const tr = document.createElement('tr');
  
  const name = document.createElement('td');
  name.innerText = user_data.personname;

  const batch = document.createElement('td');
  batch.innerText = user_data.details.batch + `-${parseInt(user_data.details.batch)+4}`;
  const degree = document.createElement('td');
  degree.innerText = user_data.details.education;

  const passout_year = `${parseInt(user_data.details.batch)+4}`;
  const user_type = document.createElement('td');
  if(passout_year >= new Date().getFullYear()) {
    user_type.innerText = 'Student';
  }
  else {
    user_type.innerText = 'Alumni';
  }

  const contact_info = document.createElement('td');
  contact_info.innerText = user_data.details.contactinfo;
  tr.append(name, batch, degree, user_type, contact_info);
  table_body.append(tr);

  tr.addEventListener('click', async (e) => {
    const userid = user_data.userid;
    window.location.href = `/protected/profile?userid=${userid}`;
  });
})

const download_button = document.querySelector('#download_event_details')
if(event_data.event_file === 'no file') {
  button_disable(download_button);
}

download_button.addEventListener('click', async () => {
  const file = await get_data(`event-file/${event_id}`)
  if (file) {
    try {
      let base64String = file;
      if (base64String.startsWith('data:')) {
        base64String = base64String.split(',')[1];
      }
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      console.error('Failed to open PDF:', error);
      alert('Invalid file data, please try later.');
    }
  } else {
    alert('An error has occurred, please try later');
  }
})

document.querySelector('#tittle').innerText = event_data.name;

document.querySelector('#event_image').src= event_data.event_logo;
document.querySelector('#event_name').innerText = event_data.name;
document.querySelector('#event_date').innerText = `Date & Time: ${formatEventDate(event_data.date)}`;
document.querySelector('#event_description').innerText = event_data.event_des;
document.querySelector('#event_location').innerText = event_data.location;
document.querySelector('#event_phone_no').innerText = event_data.contact_info.phone_no;
document.querySelector('#event_email').innerText = event_data.contact_info.email;

document.querySelector('#download_as_list').addEventListener('click', async () => {
  const table = document.querySelector('#applicants_table');
  let table_data = [];
  const header_row = table.querySelector('thead tr');
  const header_cells = Array.from(header_row.children);
  const header_data = header_cells.map(cell => cell.innerText);
  table_data.push(header_data);
  
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const row_data = Array.from(row.cells).map(cell => cell.innerText);
    table_data.push(row_data);
  })

  const select = document.querySelector('#download_as');
  const select_value = select.value;
  if(select_value === 'xlsx') {
    const ws = XLSX.utils.aoa_to_sheet(table_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    XLSX.writeFile(wb, `${event_data.name}_applicants.xlsx`);
  }
  else if(select_value === 'csv') {
    const csv = table_data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event_data.name}_applicants.csv`;
    a.click();
  }
  else if(select_value === 'txt') {
    const txtContent = table_data.map(row => row.join('\t')).join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event_data.name}_applicants.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else if(select_value === 'pdf') {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({head: [header_data], body: table_data.slice(1)});
    doc.save(`${event_data.name}_applicants.pdf`);
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
    link.download = `${event_data.name}_applicants.json`;
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
    link.download = `${event_data.name}_applicants.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
})