const express = require('express');
const path = require('path');
const router = express(); 




router.get('/alumni-directory', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
  }
  else {
  res.redirect('/login?alert=not-logged-in');
  }
});

router.get('/event-directory', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
  }
  else {
  res.redirect('/login?alert=not-logged-in');
  }
});

router.get('/job-directory', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
  }
  else {
  res.redirect('/login?alert=not-logged-in');
  }
});

router.get('/contact-us', (req, res) => {
  if(req.isAuthenticated()) {
  res.sendFile(path.join(__dirname, 'public', 'contact-us.html'))}
  else
  res.redirect('/login')
})


module.exports = router;