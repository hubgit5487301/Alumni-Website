const express = require('express');
const path =require('path');
const mongoose = require('mongoose');

const resource = require('../../models/resources')


const router = express()

router.get('/resources', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'resources', 'resources.html'))
})

router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'resources', 'notes.html'))
})

router.get('/ques_papers', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'resources', 'papers.html'))
})

router.get('/upload_resources', (req, res) => {
  const usertype = req.user.usertype;
  if(usertype === 'admin') {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'resources', 'upload_resources.html'))
  }
  else return res.redirect(`/dashboard?alert=Unauthorized-access-attempt`)
})

router.get('/notes/:branch', async (req, res) => {
  const branch = req.params.branch;
  try {
    return res.status(200).json(branch);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.get('/ques_papers/:branch', async (req, res) => {
  const branch = req.params.branch;
  try {
    return res.status(200).json(branch);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.post('/submit_resource', async (req, res) => {
  try{
    const {file_name, tags, branch, file_type, sem, subject, file} = req.body;
    const data = new resource({name: file_name, tags, branch, type: file_type, semester: sem, subject, file});
    await data.save();
    return res.status(200).json({message: 'File Uploaded'});
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})
router.get
module.exports = router;