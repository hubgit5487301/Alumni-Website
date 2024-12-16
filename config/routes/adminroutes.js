const express = require('express');
const path = require('path')

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
module.exports = router;