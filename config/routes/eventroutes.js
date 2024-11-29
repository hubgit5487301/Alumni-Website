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
    const newEvent = new event({
      name,
      date,
      location,
      contact_info,
      event_des,
      event_file,
      event_logo: logo,
    })
    res.status(200).json({message: 'data submitted'})
  }
  catch(err) {
    res.status(500).json({error:'failed to save data'});
    console.log(err);
  }
});


module.exports = router;