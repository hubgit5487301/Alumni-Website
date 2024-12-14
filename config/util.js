const crypto = require('crypto');
const sharp = require('sharp');
const emailuser = process.env.user;
const pass = process.env.pass;
const service = process.env.service;
const verificationtoken = require('../models/verificationtoken');
const user = require('../models/users');
const nodemailer = require('nodemailer');
const { API_BASE_URL } = require('../protected/protected-scripts/config');

function hashPassword(getpassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordhash = crypto.pbkdf2Sync(getpassword, salt, 1000, 64, 'sha256').toString('hex');
  return {salt, passwordhash };
}

function hashloginPassword (password, salt) {
  const passwordhash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return passwordhash;
}


function verifyPassword(password, storedhash, salt) {
  const hashinput = hashloginPassword(password, salt);
  return hashinput == storedhash;
}


function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
    res.redirect('/login')
}

async function resizeimage(inputimage, quality, format, size) {
  if(!inputimage) {
    return null;
  }

  const match = inputimage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  if(!match) {
    throw new Error('invalid image');
  }

  const base64body = match[2];
  const padlength = (base64body.match(/=+$/) || [''])[0].length;
  const sizeinbytes = ((base64body.length * 3) / 4 - padlength);

  const imagetype = match[1];
  const imagebuffer = Buffer.from(base64body, 'base64');const metadata = await sharp(imagebuffer).metadata();
  let { width, height } = metadata;
  let resizedbuffer = '' ;
  try {
    resizedbuffer = imagebuffer;
  while ( sizeinbytes >= size && quality >1) {
    const newWidth = Math.floor(width * 0.3);
     resizedbuffer = await sharp(resizedbuffer)
     .resize({width: newWidth})
    .toFormat(format, {quality})
    .toBuffer();

    const newbase64 = resizedbuffer.toString('base64');
    const newsize = (newbase64.length * 3) / 4 - (newbase64.match(/=+$/) || [''])[0].length;
    if(newsize <= size) {
      break;
    }
     quality -= 10 ;
  }
    const resizedBase64String = `data:image/${imagetype};base64,${resizedbuffer.toString('base64')}`;
    return resizedBase64String;
 }
  catch(err) {
    console.error('error resizing image', err);
    throw err;
  }
}

async function generatetoken(userid) {
  try{
    const newuser = await user.findOne({userid: userid});
    if(!newuser) {
      console.log('no user found');
      throw new Error('user not found');
    }

    const token = crypto.randomBytes(16).toString('hex');
    const newverificationtoken = new verificationtoken({
      userId: userid,
      token: token
    });
    await newverificationtoken.save();
    return token;
  }
  catch(err) {
    console.log(err);
    throw err;
  }
  
}

async function sendlink(email, token) {
  try{
    const transporter = nodemailer.createTransport({
      host: service,
      port: 465,
      secure: true,
      auth: {
        user: emailuser,
        pass: pass,
      }
    })
    const mailoption = {
      from: emailuser,
      to: email,
      subject: 'Account Verfication',
      text: `Your acount verfiaction link is ${API_BASE_URL}/verify_account?token=${token}. It will expire in 10 minutes`,
    }
    const info = await transporter.sendMail(mailoption);
    console.log('Email sent: %s', info.messageId);
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}



module.exports = { hashPassword, verifyPassword, isAuthenticated, resizeimage, generatetoken, sendlink};