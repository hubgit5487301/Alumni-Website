const express = require('express');
const mongoose = require('mongoose');

const job = require('../../models/jobs')
const router = express();


router.post('/submit-job', async (req, res) => {
  try{
    const { job_tittle, job_location, job_salary, job_type, job_level, job_des,
      job_edu, job_exp_level, job_deadline, job_app_email, job_resume,job_company_name, job_company_website, job_company_des, job_contact_info, job_company_logo, } = req.body;

    const new_job_salary = job_salary || undefined;
    const new_job_type = job_type || undefined;
    const new_job_level = job_level || undefined;
    const new_job_resume = job_resume || undefined;
    const new_job_company_website = job_company_website || undefined;
    const new_job_company_logo = job_company_logo || undefined;
    
    const new_job =  new job({
      job_tittle, job_location, new_job_salary, new_job_type, new_job_level, job_des, job_edu, job_exp_level, job_deadline, job_app_email, new_job_resume,job_company_name, new_job_company_website, job_company_des, job_contact_info, new_job_company_logo, 
    });
    await new_job.save();
    return res.status(200).json({message: 'Data Submitted'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Failed to save data'})
  }
})

module.exports = router;