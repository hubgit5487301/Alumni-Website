const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const emailuser = process.env.user;
const pass = process.env.pass;
const service = process.env.service;

const nodemailer = require('nodemailer');
const user = require('../../models/users');
const event = require('../../models/events');
const job = require('../../models/jobs');
const resources = require('../../models/resources')

const router = express();
const {usertype_and_batchSet, startOfToday, endOfToday} = require('../util');
const events = require('../../models/events');
const jobs = require('../../models/jobs');

router.get('/manage_jobs', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'jobs.html'))
  })

router.get('/manage_users', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'users.html'))
  })

router.get('/', (req, res) => {
  if(req.user.usertype === 'admin')
    return res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'admin.html'))
  else {
    return res.redirect(`/dashboard`) 
  }
  })

router.get('/manage_events', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'events.html'))
})

router.get('/alerts', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'alerts.html'))
})

router.get('/manage_event', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-applicants.html'))
})

router.get('/get_stats', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const session = mongoose.connection.collection('sessions');
      const active_users = await session.countDocuments();
      const total_users = await user.countDocuments({usertype:{ $ne: 'admin'}});
      const total_events = await event.countDocuments();
      const total_jobs = await job.countDocuments();
      const total_alumni = await user.countDocuments({usertype: 'alumni'});
      const total_students = await user.countDocuments({usertype: 'student'});
      const cse_users = await user.countDocuments({'details.branch': 'CSE',usertype: { $ne: 'admin'}});
      const ece_users = await user.countDocuments({'details.branch': 'ECE', usertype:{ $ne: 'admin'}});
      const ee_users = await user.countDocuments({'details.branch': 'EE',usertype:{ $ne: 'admin'}});
      const me_users = await user.countDocuments({'details.branch': 'ME',usertype:{ $ne: 'admin'}});
      const ce_users = await user.countDocuments({'details.branch': 'CE', usertype:{ $ne: 'admin'}});
      const full_time = await job.countDocuments({job_type: 'Full Time'});
      const part_time = await job.countDocuments({job_type: 'Part Time'});
      const internships = await job.countDocuments({job_type: 'Internship'});
      const contract = await job.countDocuments({job_type: 'Contract'});
      const notes = await resources.countDocuments({type: 'Notes'});
      const papers = await resources.countDocuments({type: 'qpapers'})
      const stats_data = ({
        total_users, total_alumni, total_students, cse_users, me_users, ee_users, ece_users, ce_users, total_events, total_jobs, full_time, part_time, internships, contract, notes, papers, active_users
      })
      return res.status(200).json(stats_data);
    }
    else {
      return res.status(404).json({message: 'unauthorized'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/graph_data', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') { 
      const job_types = ['Full Time', 'Part Time', 'Internship', 'Contract'];
      const job_count = {};
      const applicant_count = {};
      for(const job_type of job_types) {
      job_count[job_type] = await job.countDocuments({job_type: job_type});
      let total_applicants = 0;
      const jobs = await job.find({job_type: job_type}, {applicants: 1});
      jobs.forEach(job => {
          total_applicants += job.applicants.length;
      })
      applicant_count[job_type] = total_applicants;
      }
      const event_count = {};
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear+1, 0, 1); 
      const events_dates = await events.find({date: {$gte: startOfYear , $lt: endOfYear}}, {date: 1});
      events_dates.forEach(event => {
        const month = event.date.getMonth();
        if(!event_count[month]) {
          event_count[month] = 0;
        }
        event_count[month] += 1;
      })
      const data = {job_count, applicant_count, event_count};
      res.status(200).json(data);
    }
    else {
      return res.status(404).json({message: 'unauthorized'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/admin_data', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const admin_data = await user.find({usertype: 'admin', verified: true, userid: {$ne : '248650'}}, {userid: 1, personimage: 1, personname: 1});
      return res.status(200).json(admin_data);
    }
    else {
      return res.status(404).json({message: 'unauthorized'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
  }
})

router.patch('/manage_users/revoke_admin', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      if(userid === '248650') {return res.status(404).json({message: 'unauthorized'})};
      const {usertype, batch} = usertype_and_batchSet(userid);
      await user.updateOne(
        {userid: userid},
        {$set: {usertype: usertype}})
      return res.status(200).json({message: 'admin rights revoked', usertype})
    }
    else{
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
  }
})

router.delete('/manage_users/remove_user', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      await user.deleteOne({userid:userid});
      return res.status(200).json({message: 'user deleted'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.delete('/manage_events/remove_event', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const _id = req.query._id;
      const data = await events.findOne({_id:_id},{userid: 1});
      const userid = data.userid;
      await user.updateOne({userid: userid}, {$pull: {"data.event_ids": {event_id: _id}}})
      const response = await events.deleteOne({_id:_id}); 
      if(response.deletedCount > 0) return res.status(200).json({message: 'event deleted'})
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/today_new_jobs_data', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const today_jobs = await job.find({_id: {$gte: startObjectId, $lt: endObjectId}}, {job_tittle: 1, job_company_logo: 1, job_deadline: 1});
      return res.status(200).json(today_jobs);
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.delete('/manage_jobs/remove_job', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const _id = req.query._id;
      const data = await job.findOne({_id:_id},{userid: 1});
      const userid = data.userid;
      await user.updateOne(
        {userid: userid},
        {$pull: {"data.job_ids": {job_id: _id}}})

      await job.deleteOne({_id:_id});
      return res.status(200).json({message: 'job deleted'});
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/manage_users/search_users', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const query = req.query;
      const result = await user.find({
        personname: { $regex: `^${query.personname}`, $options: 'i' },
        'details.batch': { $regex: `^${query.batch}`, $options: 'i' },
        'details.branch': { $regex: `^${query.branch}`, $options: 'i' },
        $and :[{userid: {$regex: `^${query.userid}`,  $options: 'i'}},
        {userid: {$ne: '248650'}}]
      }, {userid: 1, personname: 1, usertype: 1, 'details.batch': 1, 'details.branch': 1, verified: 1, email: 1});
      return res.status(200).json(result); 
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/users', async (req,res) => {
  try {
    if(req.user.usertype === 'admin') {
      const users = await user.find({}, {userid: 1, personname: 1, personimage: 1, usertype: 1, verified: 1, email: 1, 'details.batch': 1, 'details.branch': 1 }).sort({personname: 1});
      const filteredUsers = users.filter(user => user.userid !== '248650');
      const admins = filteredUsers.filter(user => user.usertype === 'admin');
      const alumni = filteredUsers.filter(user => user.usertype === 'alumni');
      const students = filteredUsers.filter(user => user.usertype === 'student');
      const data = ({alumni, students, admins});
      res.status(200).json(data);
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch (err){
    console.log(err);
    res.status(500).json({error: 'Error getting users',err})
  }
})

router.patch('/manage_users/set_admin', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      await user.updateOne({userid: userid},{
        $set: {usertype: 'admin'}
      })
      return res.status(200).json({message: 'Admin Added'});
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }catch (err){
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/manage_events/events', async (req, res) =>{
  try{
    if(req.user.usertype === 'admin') {
      const past_events = await events.aggregate([
          {$match: {date: {$lt: startOfToday}}},
          {$project : { name: 1, date: 1, location: 1, 'contact_info.email': 1, applicants_count: { $size: '$applicants'}}},
          {$sort: {date: -1}}
      ]);
      const today_events = await events.aggregate([
        {$match : {date: {$gte: startOfToday, $lt: endOfToday}}},
        {$project: {name: 1, date: 1, location: 1, 'contact_info.email': 1, applicants_count: { $size: '$applicants'}}},
        {$sort: {name: 1}}
      ]);
      const upcoming_events = await events.aggregate([
        {$match: {date: {$gt: endOfToday}}},
        {$project: {name: 1, date: 1, location: 1, 'contact_info.email': 1, applicants_count: { $size: '$applicants'}}},
        {$sort: {date: 1}}  
      ]);
      res.status(200).json({past_events, today_events, upcoming_events}); ;
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'error getting events',err});
  }
})

router.get('/manage_events/search_events', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      let {event_name, date, location} = req.query;
      let results;
      if(date && !isNaN(Date.parse(date))) {
        const startDate = new Date(date + 'T00:00:00'); 
        const endDate = new Date(date + 'T23:59:59');  
        results = await events.aggregate([
          {$match: {date: {$gte: startDate, $lt: endDate}, name: {$regex: event_name, $options: 'i'}, location :{$regex: location, $options: 'i'}}}, {$project: {name: 1, date: 1, location: 1, 'contact_info.email': 1, applicants_count: { $size: '$applicants'}}}, {$sort: {date: 1}}]);
      }
      else 
        results = await events.aggregate([
          {$match: {
            name: {$regex: event_name, $options: 'i'}, location :{$regex: location, $options: 'i'}
          }},
          {$project: {name: 1, date: 1, location: 1, 'contact_info.email': 1, applicants_count: { $size: '$applicants'}}},
          {$sort : {date: 1}}
        ]);
      if(results.length === 0){
        return res.status(200).json([]);
      }
      res.status(200).json(results);
    }
    else {
      return res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal servor error'});
  }
});

router.get('/manage_jobs/jobs', async(req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const full_time = await jobs.aggregate([
        {$match: {job_type: 'Full Time'}},
        {$project: {job_tittle: 1, job_company_name: 1, job_deadline: 1, job_salary: 1, job_location: 1, applicants_count: { $size: '$applicants'}}},
        {$sort :{job_deadline: 1}}
      ]);
      const part_time = await jobs.aggregate([
        {$match: {job_type: 'Part Time'}},
        {$project: {job_tittle: 1, job_company_name: 1, job_deadline: 1, job_salary: 1, job_location: 1, applicants_count: { $size: '$applicants'}}},
        {$sort :{job_deadline: 1}}
      ]);
      const internships = await jobs.aggregate([
        {$match: {job_type: 'Internship'}},
        {$project: {job_tittle: 1, job_company_name: 1, job_deadline: 1, job_salary: 1, job_location: 1, applicants_count: { $size: '$applicants'}}},
        {$sort :{job_deadline: 1}}
      ]);
      const contract = await jobs.aggregate([
        {$match: {job_type: 'Contract'}},
        {$project: {job_tittle: 1, job_company_name: 1, job_deadline: 1, job_salary: 1, job_location: 1, applicants_count: { $size: '$applicants'}}},
        {$sort :{job_deadline: 1}}
      ]);
      res.status(200).json({full_time, part_time, internships, contract});
    }
    else {
      res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err);
  }
})

router.get(`/manage_jobs/search_jobs`, async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const {job_tittle, job_company_name, job_location, job_status } = req.query;
      let results;
      if(job_status === '') {
      results = await job.aggregate([
        {$match : {
          job_tittle: { $regex: `^${job_tittle}`, $options: 'i' }, job_company_name: { $regex: `^${job_company_name}`, $options: 'i' }, job_location: { $regex: `^${job_location}`, $options: 'i' }
        }},
        {$project: {
          job_tittle: 1, job_company_name: 1, job_location: 1, job_deadline: 1, job_salary: 1, applicants_count: { $size: '$applicants'}
        }},
        {$sort: {job_tittle: 1}}
      ]);
      }
      else if(job_status.toLowerCase() === 'active') {
        results = await job.aggregate([
          {$match: {
            job_tittle: { $regex: `^${job_tittle}`, $options: 'i' }, job_company_name: { $regex: `^${job_company_name}`, $options: 'i' }, job_location: { $regex: `^${job_location}`, $options: 'i'},
            job_deadline: {$gte: startOfToday}
          }
          },
          {$project: {
            job_tittle: 1, job_company_name: 1, job_location: 1, job_deadline: 1, job_salary: 1, applicants_count: { $size: '$applicants'}
          }},
          {$sort: {job_tittle: 1}}
        ]);
      }
      else if(job_status.toLowerCase() === 'expired') {
        results = await job.aggregate([
          {$match: {
            job_tittle: { $regex: `^${job_tittle}`, $options: 'i' }, job_company_name: { $regex: `^${job_company_name}`, $options: 'i' }, job_location: { $regex: `^${job_location}`, $options: 'i'},
            job_deadline: {$lt: startOfToday}
          }
          },
          {$project: {
            job_tittle: 1, job_company_name: 1, job_location: 1, job_deadline: 1, job_salary: 1, applicants_count: { $size: '$applicants'}
          }},
          {$sort: {job_tittle: 1}}
        ]);
      }
      return res.status(200).json(results);
    }
    else res.status(404).json({message: 'unauthorized'});
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.post('/alerts', async(req, res) => {
  try {
    if(req.user.usertype === 'admin'){  
      const {from, to, subject, message} = req.body;
      let users_by_type;
      let info;
      if(to === 'all') {
        users_by_type = await user.find({}, {email: 1});
      }
      else {
        users_by_type = await user.find({usertype: to}, {email: 1});
      }
      const transporter = nodemailer.createTransport({
        host: service,
        port: 465,
        secure: true,
        auth: {
          user: emailuser,
          pass: pass,
        }
      })
      users_by_type.forEach(async user => {
        const mail_option = {
          from: `${from} ${emailuser}`,
          to: user.email,
          subject: subject,
          text: message,
        }
        info = await transporter.sendMail(mail_option);
        console.log('Email sent: %s', info.messageId);
      })
      if(info) {
        return res.status(200).json({message: 'Emails sent successfully'});
      }
      else {
        return res.status(500).json({message: 'Emails not sent, try again later'});
      }
    }
    else {
      res.status(404).json({message: 'unauthorized'});
    }
  }
  catch(err) {
    console.log(err)
    res.status(500).json({error: 'internal server error'})
  }
})

router.patch('/manage_users/verify_user', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      const response = await user.updateOne({userid: userid}, {$set: {verified: true }});
      if(response.modifiedCount > 0) {
        return res.status(200).json({message: 'Account Verified'});
      }
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'internal server error'})
  }
})

module.exports = router;