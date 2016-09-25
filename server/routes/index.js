const router = require('express').Router();

router.get('/saved', function(req,res, next){
  res.send('hello');
})

router.use('/pipe', require('./pipe'));

module.exports = router;
