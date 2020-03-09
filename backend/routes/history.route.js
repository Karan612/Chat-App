const express = require('express');
const app = express();
const historyRoute = express.Router();

// History model
let History = require('../model/history');

// Add History
historyRoute.route('/add-history').post((req, res, next) => {
  History.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all History
historyRoute.route('/get-history').get((req, res) => {
  History.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get Room History
historyRoute.route('/room-history/:id').get((req, res) => {
  History.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Delete History
historyRoute.route('/delete-history/:id').delete((req, res, next) => {
  History.findByIdAndRemove(req.params.id, (error, data) => {
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

module.exports = historyRoute;