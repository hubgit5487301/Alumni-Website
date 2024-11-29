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
    console.log(date);
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
    //console.log(newEvent)
    const eventDate = new Date(req.body.date);
    const findeventbydate = await event.findOne({date: eventDate});
    const findeventbyname = await event.findOne({name: name});
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


module.exports = router;