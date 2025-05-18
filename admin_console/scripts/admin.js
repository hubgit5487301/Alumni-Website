import { getdataonevent as get_data } from "../scripts/util.js";

const data = await get_data('get_stats');

const graph_data = await get_data('graph_data');

document.querySelector('#total_users').innerText = 'Total Users: '+data.total_users;
document.querySelector('#total_events').innerText = 'Total Events: '+data.total_events;
document.querySelector('#total_jobs').innerText = 'Total Jobs: '+data.total_jobs;
document.querySelector('#active_users').innerText = 'Active Users: '+data.active_users;


const centerTextPlugin = {
  id: 'centerText', 
  afterDatasetDraw: function(chart) {
    let width = chart.width,
    height = chart.height,
    ctx = chart.ctx;
    
    ctx.restore();
    let fontSize = (height / 15).toFixed(0);
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    
    let text = chart.options.centerText || '',
    textX = Math.round(width / 2),textY = Math.round(height / 2);
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};
      
Chart.register(centerTextPlugin);


const users_by_type = document.querySelector('#users_by_type').getContext('2d');
new Chart(users_by_type,{
  type: 'doughnut',
  data : {
    labels: ['Students',  'Alumni', null],
    datasets: [{
      label : '',
      data: [data.total_students, data.total_alumni],
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: ['rgba(98, 151, 226, 0.72)' ,'rgba(255, 0, 0, 0.72)'],
      tension: 0.1,
      spacing: 1.5
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    hoverOffset: 10,
    responsive: false,
    cutout: '80%',
    centerText: 'Users By Type',
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'rgba(0, 0, 0, 0)',
      },
      labels: {
        render: function (args) {
          let percentage = ((args.value / args.dataset.data.reduce((a, b) => a + b) * 100).toFixed(0) + '%');
          return `${args.label}: ${percentage}`;
        },
        fontColor: 'black',
        position: "outside",
        fontStyle: 'bolder',
        arc: true
      }
    },
    layout: {
      padding: 27 
    }
  }
});

const users_by_branch = document.querySelector('#users_by_branch').getContext('2d');
new Chart(users_by_branch,{
  type: 'doughnut',
  data: {
    labels: ['CSE',  'ME',  'ECE',  'EE',  'CE'],
    datasets: [{
      label: '',
      data: [data.cse_users, data.me_users, data.ece_users, data.ee_users, data.ce_users],
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: ['#3A8DFF', '#2F73D6', '#274A99', '#4F6C8D', '#5D89A9'],
      tension: 0.1,
      spacing: 5
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    hoverOffset: 10,
    responsive: false,
    cutout: '80%',
    centerText: 'Users By Branch',
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'rgba(0, 0, 0, 0)',
      },
      labels: {
        render: function (args) {
          let percentage = ((args.value / args.dataset.data.reduce((a, b) => a + b) * 100).toFixed(0) + '%');
          return `${args.label}: ${percentage}`;
        },
        fontColor: 'black',
        position: "outside",
        fontStyle: 'bolder',
        arc: true
      }
    },
    layout : {
      padding: 27
    }
  }
});

const jobs_by_type = document.querySelector('#jobs_by_type').getContext('2d');

new Chart (jobs_by_type, {
  type: 'doughnut',
  data: {
    labels: ['Part Time', 'Full Time', 'Internship', 'Contract'],
    datasets: [{
      label: '',
      data: [data.part_time, data.full_time, data.internships, data.contract],
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: ['#3A8DFF', '#2F73D6', '#274A99', '#4F6C8D'],
      spacing: 5,
      tension: 0.1,
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    hoverOffset: 10,
    responsive: false,
    cutout: '80%',
    centerText: 'Jobs By Type',
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'rgba(0, 0, 0, 0)',
      },
      labels: {
        render: 'percentage',
        fontColor: 'black',
        position: "outside",
        fontStyle: 'bolder',
        arc: true
      }
    },
    layout: {
      padding: 27 
    }
  }
});

const files_by_type  = document.querySelector('#files_by_type').getContext('2d');

new Chart(files_by_type, {
  type: 'doughnut',
  data: {
    labels: ['Notes', 'Papers'],
    datasets: [{
      label: '',
      data: [data.notes, data.papers],
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: ['#3A8DFF', '#2F73D6'],
      spacing: 1.5
    }]
  },
  plugin: [ChartDataLabels],
  options: {
    hoverOffset: 10,
    responsive: false,
    cutout: '80%',
    centerText: 'Files By Type',
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'rgba(0, 0, 0, 0)',
      },
      labels: {
        render: function (args) {
          let percentage = ((args.value / args.dataset.data.reduce((a, b) => a + b) * 100).toFixed(0) + '%');
          return `${args.label}: ${percentage}`;
        },
        fontColor: 'black',
        position: "outside",
        fontStyle: 'bolder',
        arc: true
      }
    },
    layout: {
      padding: 27
    }
  }
});

const active_users_chart = document.querySelector('#all_active_users').getContext('2d');

new Chart(active_users_chart, {
  type: 'doughnut',
  data: {
    labels: ['Active', 'Inactive'],
    datasets: [{
      label: '',
      data: [data.active_users, data.total_users - data.active_users],
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: ['#3A8DFF', '#2F73D6'],
      spacing: 1.5
    }]
  },
  plugin: [ChartDataLabels],
  options: {
    hoverOffset: 10,
    responsive: false,
    cutout: '80%',
    centerText: 'Active Users',
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'rgba(0, 0, 0, 0)',
      },
      labels: {
        render: function (args) {
          let percentage = ((args.value / args.dataset.data.reduce((a, b) => a + b) * 100).toFixed(0) + '%');
          return `${args.label}: ${percentage}`;
        },
        fontColor: 'black',
        position: "outside",
        fontStyle: 'bolder',
        arc: true
      }
    },
    layout: {
      padding: 27
    }
  }
});


const job_graph = document.querySelector('#jobs_graph').getContext('2d');

new Chart(job_graph, {
  type: 'line',
  data: {
    labels: Object.keys(graph_data.job_count),
    datasets: [{
      label:'Jobs',
      data: Object.values(graph_data.job_count),
      fill: false,
      borderColor: 'rgba(98, 151, 226, 0.72)',
      tension: 0.1,
    },
    {
      label:'Applicants',
      data: Object.values(graph_data.applicant_count),
      fill: false,
      borderColor: 'rgba(255, 0, 0, 0.72)',
      tension: 0.1,
    }
  ]},
  options: {
    centerText : 'Jobs and Applicants',
    responsive: true,
    scales: {
      y: {beginAtZero: true, grid: {drawOnChartArea: false}},
      x: {grid: {drawOnChartArea: false}}
    },
    plugins: {
      legend: { display: true , position: 'top', labels: {pointStyle: 'circle', usePointStyle: true, useBorderRadius: true}},
      tooltip: { enabled: true },
    },
    layout: {padding: 5}
  }
});

const events_graph = document.querySelector('#events_graph').getContext('2d');

new Chart(events_graph, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [{
        label: 'Events',
        data: Object.values(graph_data.event_count),
        fill: false,
        borderColor: 'rgba(98, 151, 226, 0.72)',
        tension: 0.1,
    }]
  },
  options: {
    centerText : 'Events this year',
    responsive: true,
    scales: {
      y: {beginAtZero: true, grid: {drawOnChartArea: false}},
      x: {grid: {drawOnChartArea: false}}
    },
    plugins: {
      legend: { display: true , position: 'top', labels: {pointStyle: 'circle', usePointStyle: true, useBorderRadius: true}},
      tooltip: { enabled: true },
    },
    layout: {padding: 5}
  }
})