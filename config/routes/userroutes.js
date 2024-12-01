const express = require('express');
const path = require('path');

const router = express();
const user = require('../../models/alumni.js');



router.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
  console.log('alumni')
});

router.get('/alumni-directory', (req, res) =>{
  res.sendFile(path.join(__dirname, '..','..', 'protected', 'alumni-directory.html'));
})

router.get('/users', async (req,res) => {
  try {
    const users = await user.find();
    users.forEach((user) => {
      user._id = null;
      user.salt = null;
      user.passwordhash = null;
      user.details = null;
      user.email = null;
    })      
    res.status(200).json(users);
  }
  catch (err){
    res.status(500).json(console.log('Error getting users',err))
  }
})

router.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'profile.html'))
})

router.get(`/users/:userid`, async (req,res) =>{
  try {
    const userid = req.params.userid;
    const founduser = await user.findOne({userid});
    founduser._id = null;
    founduser.salt = null;
    founduser.passwordhash = null;
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json(console.log('user not found'));
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get('/alumni-search', async (req, res) => {
  const input = req.query.name;
  try{
    const results = await user.find({
      personname: { $regex: input, $options: 'i' }
    });
    results.forEach((user, index) => {
      const user_search = user.toObject();
      user_search._id = null;
      user_search.salt = null;
      user_search.passwordhash = null;
      user_search.details = null;
      user_search.email = null;
      results[index] = user_search;
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

router.get('/job-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'jobs.html'))
})

router.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'contact-us.html'))
})


router.get('/job-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'job-form.html'))
})

module.exports = router;