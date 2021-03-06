const router = require('express').Router();

router.get('/', function(req,res, next){
  res.send('hello');
})

router.use('/nps', require('./nps'));
router.use('/fittings', require('./fittings'));
router.use('/pipe', require('./pipe'));

module.exports = router;
