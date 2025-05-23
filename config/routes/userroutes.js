const express = require('express');
const path = require('path');

const router = express();
const user = require('../../models/users');
const jobs = require('../../models/jobs');
const events = require('../../models/events');
const { resizeimage } = require('../util');

router.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

router.get('/alumni-directory', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'alumni-directory.html'));
})

router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'profile.html'))
})

router.get('/users', async (req,res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const users = await user.find({usertype: {$ne: 'admin'}}, {personname: 1, personimage: 1, userid: 1, usertype: 1, _id: 0}).skip(skip).limit(limit);
    res.status(200).json(users);
  }
  catch (err){
    res.status(500).json({error: 'Error getting users',err})
  }
})

router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'profile.html'))
})

router.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'contact-us.html'))
})

router.get('/my-profile-page', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile.html'))
})

router.get(`/myprofile-appli`, async (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-appli.html'));
})

router.get('/my-profile/edit_profile_info', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-info-edit.html'));
})

router.get(`/user_profile`, async (req,res) =>{
  try {
    const {userid} = req.query;
    const founduser = await user.findOne({userid}, {_id: 0, salt: 0, passwordhash: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get('/alumni-search', async (req, res) => {
  const {personname, batch, branch } = req.query;
  if(!personname && !batch && !branch) {
    return res.status(200).json([]);
  }
  try{
    let regexpattern = '';
    if(personname.length === 1) {
      regexpattern = `^${personname}`;
    }
    else {
      regexpattern = `\\b${personname}\\b`
    }
    const results = await user.find({
      personname: { $regex: regexpattern, $options: 'i' },
      "details.batch": {$regex: `^${batch}`, $options: 'i' },
      "details.branch": {$regex: `^${branch}`, $options: 'i'}},
      {personname: 1, personimage: 1,userid: 1 , usertype: 1}
    );
  if(results === undefined){
    return res.status(200).json([]);
  }
  const filteredUsers = results.filter(user => user.usertype !== 'admin');
  res.status(200).json(filteredUsers);
  }
  catch(err) {
    res.status(500).json({error: 'internal servor error'});
  }
});

router.get('/my-profile', async (req, res) => {
  try {
    if(req.isAuthenticated()) {  
      const data = ({userid: req.user.userid, personname: req.user.personname, personimage: req.user.personimage, details: req.user.details, usertype: req.user.usertype});
      data.details.resume = '';
      res.status(200).json(data);
    } 
    else {
      res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-usertype', async (req, res) => {
  try {
    if(req.isAuthenticated()) {
      const data = ({ usertype: req.user.usertype });
      res.status(200).json(data);
    }
    else {
      res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-userid', async (req, res) => {
  try{
    if(req.isAuthenticated()) {
      const data = ({ userid: req.user.userid });
      res.status(200).json(data);
    }
    else {
      res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/user_logo', (req, res) => {
  try {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user.personimage);
    }
    else {
      res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

router.get('/user_info', (req, res) => {
  try {
    if(req.isAuthenticated()) {
      const data = ({aboutme: req.user.details.aboutme, education: req.user.details.education, currentrole: req.user.details.currentrole, experience: req.user.details.experience, contactinfo: req.user.details.contactinfo})
      res.status(200).json(data);
    }
    else {
      res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

router.get('/user_name', async (req, res) => {
  try{
    const user_name = req.user.personname;
    if(!user_name) {
      return res.status(404).json({message: 'user not found'});
    }
    return res.status(200).json({user_name}); 

  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'});
  }
})

router.get(`/myprofile-posts`, async (req, res) => {
  try {
    const usertype = req.user.usertype;
    if(usertype === 'alumni' || usertype === 'admin') return res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-posts.html'));
    else return res.redirect(`/protected/my-profile-page`)
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-jobs-events-applied', async (req, res) => {
  try{
    const userid = req.user.userid;
    const all_jobs_ids = await jobs.find({'applicants.applicant': userid },{_id: 1, job_deadline: 0}).sort({date: -1});
    const all_events_ids = await events.find({'applicants.applicant': userid },{_id: 1, date: 0}).sort({date: -1});
    const data = ({all_jobs_ids, all_events_ids});
    res.status(200).json(data);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-jobs-events-posts', async (req, res) => {
  try{
    const userid = req.user.userid;
    const all_data_events = await user.findOne({userid}, {'data.event_ids': 1});
    const all_data_jobs = await user.findOne({userid}, {'data.job_ids': 1});
    const event_ids = all_data_events.data.event_ids;
    const job_ids = all_data_jobs.data.job_ids;
    const data = ({event_ids, job_ids});
    res.status(201).json(data);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
}),

router.patch('/my-profile/edit-profile-pic', async (req, res) => {
  try {
    const {file64} = req.body;
    const userid = req.user.userid;
    const new_profile_pic = await resizeimage(file64, 60, 'webp', 100000)
    await user.updateOne(
      {"userid": userid},
      {$set: {"personimage": new_profile_pic}}
    ) ;
    res.status(200).json({message: 'Profile picture changed'});
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.patch('/update_details', async (req, res) => {
  try {
    const data = req.body;
    if(req.isAuthenticated()){
      const userid = req.user.userid;
      const update = await user.updateOne(
      {userid: userid},
      {
          $set: {
          "details.aboutme": data.aboutme,
          "details.education": data.education,
          "details.currentrole": data.currentrole,
          "details.experience": data.experience,
          "details.contactinfo": data.contactinfo
          }
      });
      if(update.modifiedCount>0) {
        return res.status(200).json({message: 'New details added successfully'})
      }
      else {
        return res.status(200).json({message: 'No changes made'});
      }
    }
    else {
      return res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal servor error', err});
  }
})

router.post('/my-profile/upload-resume', async (req, res) => {
  try {
    const user_id = req.user.userid;
    const file_64 = req.body.file64;
    const match = file_64.match(/^data:(.*);base64,/);
    if(match[1] == 'application/pdf')
    { const result = await user.updateOne(
        {userid: user_id}, 
        {$set: {"details.resume": file_64}
      })
      if(result) {
        return res.status(201).json({message: 'Uploaded Resume'})
      }
      else {
        return res.status(401).json({error: 'something went wrong'})
      }
    }
    else return res.status(500).json({error: 'file type not pdf'})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-profile/download-resume', async (req, res) => {
  try{
    const userid = req.user.userid;
    const result = await user.findOne({userid: userid}, {"details.resume": 1, personname: 1});

    if(result.details.resume !== 'empty') {
      return res.status(200).json({result, message: 'File Found'});
    }
    else {
      return res.status(200).json({error: 'File not found'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({err, error: 'internal server error'})
  }
})

router.get('/applicant/resume_download', async (req, res) => {
  try{
    const userid = req.query.userid;
    const file = await user.findOne({userid: userid}, {"details.resume": 1});
    return res.status(200).json({file});
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get(`/job_users`, async (req,res) =>{
  try {
    const userid = req.user.userid;
    const founduser = await user.findOne({userid}, {personname: 1, "details.branch": 1, _id: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get(`/event_users`, async (req,res) =>{
  try {
    const userid = req.user.userid;
    const founduser = await user.findOne({userid}, {personname: 1, "details.branch": 1, _id: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get('/download-resume/:user_id', async (req, res) => {
  try{
    const userid = req.params.user_id
    const result = await user.findOne({userid: userid}, {"details.resume": 1, personname: 1});

    if(result.details.resume !== 'empty' && result.details.resume !== '' && result.details.resume !== null) {
      return res.status(200).json({result, message: 'File Found'});
    }
    else {
      return res.status(200).json({error: 'File not found'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({err, error: 'internal server error'})
  }
})

router.delete('/my_profile_appli/delete_job', async (req, res) => {
  try{
    const userid = req.user.userid;
    const _id = req.query._id;
    const test = ({userid, _id});
    const response = await jobs.updateOne(
      {_id: _id}, 
      {$pull: {"applicants": {"applicant": userid}
    }});
    if(response.modifiedCount > 0) {
      return res.status(200).json({message: 'job application removed'})
    }
    else return res.status(404).json({message: 'job not found'})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.delete('/my_profile_appli/delete_event', async (req, res) => {
  try{
    const userid = req.user.userid;
    const _id = req.query._id;
    const test = ({userid, _id});
    const response = await events.updateOne(
      {_id: _id}, 
      {$pull: {"applicants": {"applicant": userid}
    }});
    if(response.modifiedCount > 0) {
      return res.status(200).json({message: 'event application removed'})
    }
    else return res.status(404).json({message: 'event not found'})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/my_profile_appli/job_search', async (req, res) => {
  try{
    const userid = req.user.userid;
    const {job_tittle} = req.query;
    const jobs_search = await jobs.find({job_tittle: { $regex: `^${job_tittle}`, $options: 'i'}, 'applicants.applicant': userid}, {job_tittle: 1,job_company_logo:1 , _id: 1});
    res.status(200).json(jobs_search);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/my_profile_posts/job_search', async (req, res) => {
  try{
    const {job_tittle} = req.query;
    const jobs_search = await jobs.find({job_tittle: { $regex: `^${job_tittle}`, $options: 'i'}}, {job_tittle: 1,job_company_logo:1 , job_id: '$_id', _id:0});
    res.status(200).json(jobs_search);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/my_profile_appli/event_search', async (req, res) => {
  try{
    const userid = req.user.userid;
    const {event_name} = req.query;
    const event_search = await events.find({name: { $regex: `^${event_name}`, $options: 'i'}, 'applicants.applicant': userid}, {name: 1, event_logo:1 , _id: 1});
    res.status(200).json(event_search);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/my_profile_posts/event_search', async (req, res) => {
  try{
    const {event_name} = req.query;
    const event_search = await events.find({name: { $regex: `^${event_name}`, $options: 'i'}}, {name: 1, event_logo:1 , event_id: '$_id', _id: 0});
    res.status(200).json(event_search);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/user/user_data_job', async (req, res) => {
  try{
    const {userid} = req.query;
    const user_data = await user.findOne({userid}, {userid: 1, personname: 1, "details.batch": 1, "details.currentrole": 1, "details.education": 1, _id: 0});
    if(user_data) {
      return res.status(200).json(user_data);
    }
    else {
      return res.status(404).json({message: 'user not found'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.get('/user/user_data_event', async (req, res) => {
  try{
    const {userid} = req.query;
    const user_data = await user.findOne({userid}, {userid: 1, personname: 1, "details.contactinfo": 1, "details.batch": 1, "details.currentrole": 1, "details.education": 1, _id: 0});
    if(user_data) {
      return res.status(200).json(user_data);
    }
    else {
      return res.status(404).json({message: 'user not found'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

module.exports = router;  