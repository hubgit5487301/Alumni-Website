const crypto = require('crypto');

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



module.exports = { hashPassword, verifyPassword};