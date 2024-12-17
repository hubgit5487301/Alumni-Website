const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const user = require('../../models/users');
const event = require('../../models/events');
const job = require('../../models/jobs');

const router = express();

router.get('/manage_jobs', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'jobs.html'))
  })

router.get('/manage_users', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'users.html'))
  })

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'admin.html'))
  })

router.get('/manage_events', (req, res) => {
res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'events.html'))
})

router.get('/users', async (req, res) => {
  const usertype = req.user.usertype;
  try{
    console.log(usertype)
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/get_stats', async (req, res) => {
  const usertype = req.user.usertype;
  try{
    if(usertype === 'admin') {
      const session = mongoose.connection.collection('sessions');
      const active_users = await session.countDocuments();
      const total_users = await user.countDocuments();
      const total_events = await event.countDocuments();
      const total_jobs = await job.countDocuments();


      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const startObjectId = mongoose.Types.ObjectId.createFromTime(startOfToday / 1000);
      const endObjectId = mongoose.Types.ObjectId.createFromTime(endOfToday / 1000);

      const today_events = await event.countDocuments({_id: {$gte: startObjectId, $lt: endObjectId}});
      const today_jobs = await job.countDocuments({_id: {$gte: startObjectId, $lt: endObjectId}})
      const stats_data = ({
        total_users, total_events, total_jobs, active_users, today_events, today_jobs
      })
      res.status(200).json(stats_data);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})


module.exports = router;