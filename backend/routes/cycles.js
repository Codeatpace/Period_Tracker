const router = require('express').Router();
const { getCycles, logPeriod, endPeriod, predict } = require('../controllers/cycleController');

router.get('/predict/:userId', predict);  // must be before /:userId or Express matches it as userId="predict"
router.get('/:userId',         getCycles);
router.post('/',               logPeriod);
router.put('/:id/end',         endPeriod);

module.exports = router;
