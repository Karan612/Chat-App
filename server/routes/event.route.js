const express = require('express');
const app = express();
const eventRoute = express.Router();

// Event model
let Event = require('../model/event');

// Add Event
eventRoute.route('/add-event').post((req, res, next) => {
  Event.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all Event
eventRoute.route('/get-event').get((req, res) => {
  Event.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Delete Event
eventRoute.route('/delete-event/:id').delete((req, res, next) => {
  Event.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.log('error')
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = eventRoute;