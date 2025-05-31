require('dotenv').config({path:'../.env'}); // Ensure you have a .env file with mongoURI
const MONGO_URI = process.env.mongoURI
const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../models/jobs');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchAdzunaJobs() {
  const APP_ID = '7934e306';
  const APP_KEY = 'e86be0ac8bf76918386693b7429742ac';

  try {
    const res = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=50&what=engineer&where=india`);

    const jobs = res.data.results;

    for (let job of jobs) {
      const newJob = new Job({
        userid: "adzuna-user",
        job_tittle: job.title || "Not given",
        job_location: job.location.display_name || "Unknown",
        job_salary: `${job.salary_min || ""} - ${job.salary_max || ""}` || "Not mentioned",
        job_type: job.contract_type || "Full Time",
        job_level: "Entry Level",
        job_des: job.description || "No description",
        job_edu: "Not specified",
        job_exp_level: "Not specified",
        job_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        job_app_email: "Not provided",
        job_resume: "Yes",
        job_company_name: job.company.display_name || "Unknown Company",
        job_company_website: job.redirect_url || "No url provided",
        job_company_des: "Company description not available",
        job_contact_info: "Not provided",
        job_company_logo: job.company?.logo_url||"empty",
        applicants: [],
      });

      await newJob.save();
    }

    console.log("Jobs saved from Adzuna ✅");

  } catch (err) {
    console.error("❌ Adzuna Error:", err.message);
  }
}

fetchAdzunaJobs();
