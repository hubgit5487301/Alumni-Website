const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  batch: {type: String, required: true},
  branch: { type: String, required: true},
  aboutme: {type: String, default: 'No input provided'},
  education: {type: String, default: 'No input provided'},
  currentrole: {type: String, default: 'No input provided'},
  experience: {type: String, default: 'No input provided'},
  contactinfo: {type: String, default: 'No input provided',},
  resume: {type: String, default: 'empty'},
})

const job_ids = new mongoose.Schema({
  job_id: {type: String, default: 'no data'}
})

const event_ids = new mongoose.Schema ({
  event_id: {type: String, default: 'no data'}
})

const dataSchema = new mongoose.Schema({
  job_ids: { type: [job_ids], default: []},
  event_ids: { type: [event_ids], default: []}
})

const userSchema = mongoose.Schema({
  personname: { type: String, required: true},
  userid: { type: String, required: true},
  usertype: {type: String, required: true},
  email: { type: String, required: true},
  userprivacy: {type: String, required: true, default: 'public'},
  salt: {type: String, required: true},
  passwordhash: { type: String, required: true},
  personimage: {type: String, default: 'Empty'},
  details: {type: DetailsSchema, required: true, default: () => ({})},
  data: {type: dataSchema, default: ( )=> ({})},
  verified: {type: Boolean, default: false}
})





module.exports = mongoose.model('Alumni', userSchema);
