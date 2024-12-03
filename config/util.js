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

async function resizeimage(inputimage, quality, format, size) {
  const match = inputimage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  

  if(!match) {
    throw new Error('invalid image');
  }

  const base64body = match[2];
  const padlength = (base64body.match(/=+$/) || [''])[0].length;
  console.log(padlength);
  const sizeinbytes = ((base64body.length * 3) / 4 - padlength);
  console.log(sizeinbytes);

  const imagetype = match[1];
  const imagebuffer = Buffer.from(base64body, 'base64');const metadata = await sharp(imagebuffer).metadata();
  let { width, height } = metadata;
  let resizedbuffer = '' ;
  try {
    resizedbuffer = imagebuffer;
  while ( sizeinbytes >= size && quality >1) {
    console.log(quality);
    const newWidth = Math.floor(width * 0.3);
     resizedbuffer = await sharp(resizedbuffer)
     .resize({width: newWidth})
    .toFormat(format, {quality})
    .toBuffer();

    const newbase64 = resizedbuffer.toString('base64');
    const newsize = (newbase64.length * 3) / 4 - (newbase64.match(/=+$/) || [''])[0].length;
    console.log(newsize);
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



module.exports = { hashPassword, verifyPassword, isAuthenticated, resizeimage};