const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express();
const events = require('../../models/events');



router.get('/event-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'event-form.html'))
})

router.post('/submit-event', async (req, res) => {
  try{
    const {name, date, location, contact_info, event_des, event_file, event_logo} = req.body;
    const logo = event_logo !=null ? event_logo : undefined;
    const event_date = new Date(req.body.date);
    const newEvent = new events({
      name,
      date: event_date,
      location,
      contact_info: contact_info,
      event_des,
      event_file: event_file || undefined,
      event_logo: logo,
    })
    const eventDate = new Date(req.body.date);
    const findeventbydate = await events.findOne({date: eventDate});
    const findeventbyname = await events.findOne({name: name});
    if(findeventbydate) {
      if(!findeventbyname) {
        await newEvent.save();
        return res.status(500).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    if(findeventbyname) {
      if(!findeventbydate) {
        await newEvent.save();
        return res.status(200).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    await newEvent.save();
    res.status(200).json({message: 'data submitted'});
  }
  catch(err) {
    res.status(500).json({error:'failed to save data'});
    console.log(err);
  }
});

router.get('/events', async(req, res) =>{
  try{
    const send_events = await events.find().sort({ date:1});
    send_events.forEach((event) =>{
      event.event_file = null;
      event.contact_info = null;
      event.location = null;
      event.event_des = null;
    })

    res.status(200).json(send_events) ;
  }
  catch(err) {
    res.status(500).json(console.log('error getting events',err));
  }
})

router.get(`/events/:event_id`, async (req,res) => {
  try{
    const _id = req.params.event_id;
    const found_event = await events.findOne({_id});
    if(found_event) {
      res.status(200).json(found_event);
    }
    else {
      res.status(402).json(console.log('event not found'));
    }
  }
  catch(err) {
    console.log('error fetching event',err);
    res.status(502).json({error: 'internal servor error'});
  }
})

router.get(`/event.html`, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'event.html'));
})

module.exports = router;