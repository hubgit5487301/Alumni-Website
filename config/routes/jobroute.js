const express = require('express');
const path = require('path');

const job = require('../../models/jobs');
const { resizeimage } = require('../util');
const router = express();

router.get('/job-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs.html'))
})

router.post('/submit-job', async (req, res) => {
  try{
    const { job_tittle, job_location, job_salary, job_type, job_level, job_des,
      job_edu, job_exp_level, job_deadline, job_app_email, job_resume,job_company_name, job_company_website, job_company_des, job_contact_info, job_company_logo, } = req.body;
    const new_job_company_logo = await resizeimage(job_company_logo, 70, 'webp', 200000)
    const new_job = new job({
      job_tittle, 
      job_location, 
      job_salary: job_salary || "Not mentioned",
      job_type: job_type || "Full time",
      job_level: job_level || "Entry Level",
      job_des, 
      job_edu, 
      job_exp_level, 
      job_deadline, 
      job_app_email, 
      job_resume: job_resume || "Yes",
      job_company_name, 
      job_company_website: job_company_website || "NO URL provided",
      job_company_des, 
      job_contact_info, 
      job_company_logo: new_job_company_logo || "test"
    });
    await new_job.save();
    return res.status(200).json({message: 'Data Submitted'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Failed to save data'})
  }
})

router.get('/jobs', async(req, res) => {
  try{
    const jobs = await job.find();
    jobs.forEach(job => {
      job.job_location = null;
      job.job_des = null;
      job.job_app_email = null;
      job.job_salary =  null;
      job.job_des = null;
      job.job_edu = null;
      job.job_exp_level = null;
      job.job_app_email = null;
      job.job_resume = null;
      job.job_company_website = null;
      job.job_company_des =null;
      job.job_contact_info = null;
    })
    res.status(200).json(jobs);
  }
  catch(err) {
    console.log(err);
  }
})
module.exports = router;