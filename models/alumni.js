const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  batch: {type:String, required: true},
  branch: { type:String, required: true},
  aboutme: {type:String},
  education: {type: String},
  currentrole: {type: String},
  experience: {type:String},
  contactinfo: {type:String}
})

const userSchema = mongoose.Schema({
  personname: { type:String, required:true},
  userid: { type:String, required:true},
  email: { type:String, required: true},
  salt: {type: String, required: true},
  passwordhash: { type:String, required: true},
  personimage: {type:String, default: "temp"},
  details: {type:DetailsSchema, required: true}
})

module.exports = mongoose.model('Alumni', userSchema);