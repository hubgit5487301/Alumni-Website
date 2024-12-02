const crypto = require('crypto');
const sharp = require('sharp');

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

async function resizeimage(inputimage, quality, format) {
  const match = inputimage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);

  if(!match) {
    throw new Error('invalid image');
  }

  const imagetype = match[1];
  const imagebuffer = Buffer.from(match[2], 'base64');
  
  try {
    const resizedbuffer = await sharp(imagebuffer)
    .toFormat(format, {quality:quality})
    .toBuffer();

    const resizedBase64String = `data:image/${imagetype};base64,${resizedbuffer.toString('base64')}`;
    return resizedBase64String;
  }
  catch(err) {
    console.error('error resizing image', err);
    throw err;
  }
}

module.exports = { hashPassword, verifyPassword, isAuthenticated, resizeimage};