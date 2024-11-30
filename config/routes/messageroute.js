const service = process.env.service;
const user = process.env.user;
const pass = process.env.pass;


const express = require('express');
const nodemailer = require('nodemailer');


const router = express();

router.post(`/send-message`, async (req, res) => {
  try {
    const {name, email, message} = req.body;
    console.log(message);
    const transporter = nodemailer.createTransport({
      service: service,
      auth: {
        user: user,
        pass: pass,
      }
    })

    const mailoption = {
      from: email,
      to: user,
      subject: name,
      text: message,
    };

    transporter.sendMail(mailoption, (err, info) => {
      if(err) {
        console.error(err);
        return res.status({error:'failed'})
      }
      else{
        console.log('sent:' +info.response);
      }
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: ' internal server error'})
  }

})


module.exports = router;