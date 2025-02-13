const express = require('express');
const path = require('path');

const router = express();
const events = require('../../models/events');
const user = require('../../models/users');
const { resizeimage } = require('../util');
const { updateOne } = require('../../models/jobs');


router.get('/event-form', (req, res) => {
  const usertype = req.user.usertype;
  if(usertype === 'admin') return res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-form.html'));
  else return res.redirect(`/protected/services`)
})

router.post('/submit-event', async (req, res) => {
  try{
    const {name, date, location, contact_info, event_des, eventfile, eventimage} = req.body;
    const resizedLogo = await resizeimage(eventimage, 60, 'webp', 200000); 
    const logo = resizedLogo != null ? resizedLogo : undefined;
    const userid = req.user.userid;
    const newEvent = new events({
      userid,
      name,
      date,
      location,
      contact_info: contact_info,
      event_des,
      event_file: eventfile,
      event_logo: logo,
    })
    const eventDate = new Date(req.body.date);
    const findeventbydate = await events.findOne({date: eventDate});
    const findeventbyname = await events.findOne({name: name});
    if(findeventbydate) {
      if(!findeventbyname) {
        
        const saved_data = await newEvent.save();
        const event_id = saved_data._id.toString();

        await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

          return res.status(200).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    if(findeventbyname) {
      if(!findeventbydate) {
       const saved_data = await newEvent.save();
        const event_id = saved_data._id.toString();
        
        await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

        return res.status(200).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    const saved_data = await newEvent.save();
    const event_id = saved_data._id.toString();
    await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

    res.status(200).json({message: 'data submitted'});
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error:'failed to save data'});
  }
});

router.get('/events', async (req, res) =>{
  try{
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const send_events = await events.find({}, {name: 1, date:1, event_logo:1 }).sort({ date:1}).skip(skip).limit(limit);
    res.status(200).json(send_events) ;
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'error getting events',err});
  }
})

router.get(`/events/:event_id`, async (req,res) => {
  try{
    const _id = req.params.event_id;
    let found_event = await events.findOne({_id},{applicants: 0});
    if(found_event) {
      if(found_event.event_file === 'temp' || found_event.event_file === null) {
        const text = 'no file';
        found_event.event_file = text;
      }
      else {
        found_event.event_file = 'file';
      }
      return res.status(200).json(found_event);
    }
    else {
      return res.status(402).json({error: 'event not found'});
    }
  }
  catch(err) {
    console.log('error fetching event',err);
    res.status(502).json({error: 'internal servor error'});
  }
})

router.get(`/event`, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event.html'));
})

router.get('/event-file/:event_id', async (req, res) => {
  const event_id = req.params.event_id;
  try{
    const data = await events.findOne({_id: event_id}, {event_file: 1});
    if(data.event_file !== 'temp' && data.event_file !== null) {
      return res.status(200).json(data.event_file)
    }
    else {
      res.status(200).json({error: 'No event file was provided'})
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error '})
  }
})

router.get('/event_search', async (req, res) => {
  let {name, date} = req.query;
  let results;
  try{
  if(date && !isNaN(Date.parse(date))) {
  const startDate = new Date(date + 'T00:00:00'); 
  const endDate = new Date(date + 'T23:59:59');  
  results = await events.find({
      name: { $regex: `^${name}`, $options: 'i' },
      date: { $gte: startDate, $lte: endDate}}, 
      {name: 1, date:1, event_logo:1}
    );}
  else {
    results = await events.find({
      name: { $regex: `^${name}`, $options: 'i' }}, 
      {name: 1, date:1, event_logo:1 }
    );}
  if(results.length === 0){
    return res.status(404).json({message: 'No events found for the given parameters'});
  }
  res.status(200).json(results);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

router.get('/homeevents', async (req,res) => {
  try {
    const send_events = await events.find({}, {name: 1, date:1, event_logo:1 }).sort({ date:1});
     res.status(200).json(send_events) ;
  }
  catch(err) {
    console.error('error getting events', err);
    res.status(503).json({error:'internal server error'})
  }
})

router.get('/event-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-directory.html'))
})

router.get('/event_application_check', async (req, res) => {
  try{
      const event_id = req.query.event_id;
      const userid = req.user.userid;
      const findevent = await events.findOne({"applicants.applicant": userid, "_id": event_id});
      if(findevent) return res.status(200).json({message: 'Already applied'});
      else return res.status(200).json({message: 'Not applied'});
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.get('/apply_event', async (req, res) => {
  try{
    const event_id = req.query.event_id;
    const userid = req.user.userid;
    const findevent = await events.findOne({"applicants.applicant": userid, "_id": event_id});
    if(findevent) return res.status(409).json({error: 'Already applied'});

    await events.updateOne({"_id": event_id}, {$push: {"applicants": {applicant: userid}}}
    )
    return res.status(201).json({message: 'Applied to event'})
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.delete(`/my_profile_post/delete_event`, async (req, res) => {
  try{
    const _id = req.query._id;
    const userid = req.user.userid;
    const deleteevent = await events.deleteOne({_id: _id});
    const deleteeventuser = await user.updateOne(
      {"userid": userid},
      {$pull: {"data.event_ids": {"event_id": _id}}}
    )
    if(deleteevent.deletedCount > 0 && deleteeventuser.modifiedCount > 0) {
      return res.status(200).json({message: 'event post deleted'})
    }
    return res.status(404).json({message: 'event not found'})
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})


router.get(`/my_profile_appli/my_events`, async (req, res) => {
  try{
    const _id = req.query._id;
    const applied_events = await events.findOne({_id},{event_logo: 1, name: 1});
    return res.status(200).json(applied_events);
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: 'internal server error'});
  }
})

router.get('/applicants/event', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-applicants.html'))
})

router.get('/applicants/posted_event', async (req,res) => {
  try{
    const event_id = req.query.event_id;
    const applicants_Data = await events.findOne({_id: event_id}, {applicants: 1});
    const event_data = await events.findOne({_id: event_id},{userid: 0});
    if(event_data.event_file === 'temp' || event_data.event_file === null) {
      event_data.event_file = 'no file';
    }
    else {
      event_data.event_file = 'file';
    }
    data = ({event_data, applicants_Data})
    return res.status(200).json(data);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})


module.exports = router;