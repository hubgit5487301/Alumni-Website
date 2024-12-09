const mongoose = require('mongoose');

const otpsSchema = ({
  data: {
    userid: {type: String, required: true},
    otp: {type: String, required: true}
  },
  createdAt: {type: Date, default: Date.now}
});

otpsSchema.index({createdAt: 1}, {expireAfterSecons: 600});

module.exports = ('otps', otpsSchema);