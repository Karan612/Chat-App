var mongoose = require('mongoose');
var Event = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    trim: true
  },
  timeStamp: {
    type: Number,
    required: true,
  }
});
var Event = mongoose.model('Event', Event);
module.exports = Event;