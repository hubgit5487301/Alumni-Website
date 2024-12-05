const express = require('express');
const path = require('path');

const job = require('../../models/jobs');
const { resizeimage } = require('../util');
const router = express();
const user = require('../../models/users')

router.get('/job-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs.html'))
})

router.post('/submit-job', async (req, res) => {
  try{
    const { job_tittle, job_location, job_salary, job_type, job_level, job_des,
      job_edu, job_exp_level, job_deadline, job_app_email, job_resume,job_company_name, job_company_website, job_company_des, job_contact_info, job_company_logo,userid } = req.body;
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
    
    const saved_job = await new_job.save();
    const job_id = saved_job._id.toString();

    await user.updateOne(
      {"userid": userid},
      {$push: {"data.job_ids": {job_id: job_id}}}
    )

    return res.status(200).json({message: 'Data Submitted'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Failed to save data'})
  }
})

router.get('/jobs', async(req, res) => {
  try{
    const jobs = await job.find({}, {job_tittle: 1, job_company_name: 1, job_company_logo: 1, job_deadline: 1, job_type: 1, job_level: 1}).sort({job_deadline: 1});
    res.status(200).json(jobs);
  }
  catch(err) {
    console.log(err);
  }
})

router.get(`/job`, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'job.html'))
})

router.get(`/job/:job_id`, async(req, res) => {
  try{
    const _id = req.params.job_id;
    const find_job = await job.findOne({_id});
    if(!find_job) {
      return  res.status(500).json({error: 'job not found'});
    }
    return res.status(200).json(find_job);
  }
 catch(err) {
  console.log(err);
 }
  
})

router.post(`/job-apply`, async (req, res) => {
  try {
    const {userid, job_id} = req.body;
    const findjob = await job.findOne({"applicants.applicant": userid, "_id": job_id});
    
    if(findjob) return res.status(409).json({error: 'Already applied'});
    await job.updateOne(
      {"_id": job_id},
      {$push:{"applicants": {applicant: userid}}}
    )
    return res.status(201).json({message: 'Applied to job'});
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: 'internal server error'});
  }
})
module.exports = router;