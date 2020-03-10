var mongoose = require('mongoose');
var History = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timeStamp: {
    type: Number,
    required: true,
  }
});
var History = mongoose.model('History', History);
module.exports = History;