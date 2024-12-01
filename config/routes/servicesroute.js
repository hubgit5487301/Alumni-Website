const express = require('express');
const path = require('path');

const router = express();


router.get('/services', (req,res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'services.html'));
})


module.exports = router;