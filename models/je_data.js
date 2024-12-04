const mongoose = require('mongoose');

const userjobseventSchema = new mongoose.Schema({
  userid: {tpye: String, required: true},
  job_id: {type: String, required: true},
  event_id: {type: String, required: true}
})


module.exports = mongoose.model('je_data', userjobseventSchema)
