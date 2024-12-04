const express = require('express');
const path = require('path');

const router = express();
const events = require('../../models/events');


//const userpasschange= await user.findOne({userid}, 'salt passwordhash');

router.get('/event-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'event-form.html'))
})

router.post('/submit-event', async (req, res) => {
  try{
    const {name, date, location, contact_info, event_des, event_file, event_logo} = req.body;
    const logo = resizeimage(event_logo, 60, 'webp', 200000) !=null ? event_logo : undefined;
    const event_date = new Date(date);
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

router.get('/events', async (req, res) =>{
  try{
    const send_events = await events.find({}, {name: 1, date:1, event_logo:1 }).sort({ date:1});
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

router.get('/event-search', async (req, res) => {
  const input = req.query.name;
  try{
    const results = await events.find({
      name: { $regex: input, $options: 'i' }
    });
    results.forEach((events, index) => {
      const events_search = events.toObject();
      events_search.details = null;
      events_search.contact_info = null;
      events_search.location = null;
      events_search.event_des = null;
      events_search.event_file = null; 

      results[index] = events_search;
    });
  if(results.length === 0){
    return res.status(200).json([]);
  }
  res.status(200).json(results);
  }
  catch(err) {
    res.status(500).json({error: 'internal servor error'});
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
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'event-directory.html'))
})
module.exports = router;