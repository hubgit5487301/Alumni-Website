const express = require('express');
const path = require('path');

const job = require('../../models/jobs');
const { resizeimage } = require('../util');
const router = express();
const user = require('../../models/users');

router.get('/job-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs', 'job-directory.html'))
})

router.post('/submit-job', async (req, res) => {
  try{
    const { job_tittle, job_location, job_salary, job_type, job_level, job_des,
      job_edu, job_exp_level, job_deadline, job_app_email, job_resume,job_company_name, job_company_website, job_company_des, job_contact_info, job_company_logo } = req.body;
      const userid = req.user.userid;
    const new_job_company_logo = await resizeimage(job_company_logo, 70, 'webp', 200000)
    const new_job = new job({
      userid,
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
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const jobs = await job.find({}, {job_tittle: 1, job_company_name: 1, job_company_logo: 1, job_deadline: 1, job_type: 1, job_level: 1}).sort({job_deadline: 1}).skip(skip).limit(limit);
    res.status(200).json(jobs);
  }
  catch(err) {
    console.log(err);
  }
})

router.get(`/job`, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs', 'job.html'))
})

router.get(`/job_search`, async (req, res) => {
  const {job_tittle, job_type, job_level, job_company_name } = req.query;
  try{
    const results = await job.find(
      { job_tittle: { $regex: `^${job_tittle}`, $options: 'i' },
        job_type: { $regex: `^${job_type}`, $options: 'i' },
        job_level: { $regex: `^${job_level}`, $options: 'i' },
        job_company_name: { $regex: `^${job_company_name}`, $options: 'i' }
      },
      {job_tittle: 1, job_company_name: 1, job_level: 1, job_type: 1, job_deadline: 1, job_company_logo: 1});
    if(results.length === 0) {
      return res.status(404).json({message: 'No job with given parameters found'});
    }
    return res.status(200).json(results);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
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

router.get(`/my_profile_appli/my_jobs`, async (req, res) => {
  try{
    const userid = req.user.userid;
    const _id = req.query._id;
    const applied_job = await job.findOne({_id},{job_tittle: 1, job_company_logo: 1});
    return res.status(200).json(applied_job);
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: 'internal server error'});
  }
})

router.get('/apply_job', async (req, res) => {
  try {
    const userid = req.user.userid;
    const job_id = req.query.job_id;
    const resume_check = await user.findOne({userid: userid},{"details.resume": 1}) ;
    if(resume_check.details.resume !== 'empty' && resume_check.details.resume !== null && resume_check.details.resume !== '') {
      const findjob = await job.findOne({"applicants.applicant": userid, "_id": job_id});
      if(findjob) return res.status(409).json({error: 'Already applied'});
      await job.updateOne(
      {"_id": job_id},
      {$push:{"applicants": {applicant: userid}}}
    )}
    else {
      return res.status(404).json({message: 'Please upload a resume first to your account to apply for jobs'})
    }
    return res.status(201).json({message: 'Applied to job'});
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: 'internal server error'});
  }
})

router.delete(`/my_profile_posts/delete_job`, async (req, res) => {
  try{
    const userid = req.user.userid;
    const job_id = req.query._id;
    const deletejob = await job.deleteOne({_id: job_id});
    const deletejobuser = await user.updateOne(
      {"userid": userid},
      {$pull: {"data.job_ids": {"job_id": job_id}}}
    )
    if(deletejob.deletedCount > 0 && deletejobuser.modifiedCount > 0) {
      return res.status(200).json({message: 'Job post deleted'})
    }
    
    return res.status(404).json({message: 'Job not found'})
    
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.get('/applicants/posted_job', async (req,res) => {
  try{
    const job_id = req.query.job_id;
    const applicants_data = await job.findOne({_id: job_id}, {applicants: 1, _id: 0});
    const job_data = await job.findOne({_id: job_id}, {job_company_des: 0, job_contact_info: 0, userid: 0, job_company_website: 0, job_resume: 0});
    const data = {job_data, applicants_data}
    res.status(200).json(data)
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.get('/applicants/job', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs', 'job-applicants.html'))
})

router.get('/job_application_check', async (req, res) => {
  try{
    const job_id = req.query.job_id;
    const userid = req.user.userid;
    const findjob = await job.findOne({"applicants.applicant": userid, "_id": job_id});
    if(findjob) return res.status(200).json({message: 'Already applied'});
    return res.status(200).json({message: 'Not applied'});
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

module.exports = router;