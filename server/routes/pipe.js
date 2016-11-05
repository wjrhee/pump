const express = require('express');
const router = new express.Router();
const db = require('../db/models');
const Pipe = db.model('pipe');
// const Invoice_item = db.model('invoice_item');
// const Invoice = db.model('invoice');

router.get('/', (req, res, next) => {
  return Pipe.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(next);
})
module.exports = router;
