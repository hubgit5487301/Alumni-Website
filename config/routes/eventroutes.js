const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express();
const event = require('../../models/events');



router.get('/event-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'event-form.html'))
})

router.post('/submit-event', async (req, res) => {
  try{
    const {name, date, location, contact_info, event_des, event_file, event_logo} = req.body;
    const logo = event_logo || undefined;
    const event_date = new Date(req.body.date);
    const newEvent = new event({
      name,
      date: event_date,
      location,
      contact_info: contact_info,
      event_des,
      event_file,
      event_logo: logo,
    })
    console.log(newEvent)
    const eventDate = new Date(req.body.date);
    const findeventbydate = await event.findOne({date: eventDate});
    const findeventbyname = await event.findOne({name: name});
    if(findeventbydate) {
      if(!findeventbyname) {
        await newEvent.save();
        console.log('1')
        res.status(200).json({message: 'Data submitted'});
      }
      else {
        console.log('2')
        res.status(500).json({message: 'Event of same name and at same time exists already'})
      }
    }
    if(findeventbyname) {
      if(!findeventbydate) {
        console.log('3')
        await newEvent.save();
        res.status(200).json({message: 'Data submitted'});
      }
      else {console.log('4')
        res.status(500).json({message: 'Event of same name and at same time exists already'})
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


module.exports = router;