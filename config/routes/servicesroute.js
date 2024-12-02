const express = require('express');
const path = require('path');

const router = express();


router.get('/services', (req,res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'services.html'));
})

router.get('/job-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'job-form.html'))
})


module.exports = router;