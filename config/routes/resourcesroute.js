const express = require('express');
const path =require('path');


const router = express()

router.get('/resources', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'resources', 'resources.html'))
})


module.exports = router;