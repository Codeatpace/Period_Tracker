const router = require('express').Router();
const { getUsers, createUser } = require('../controllers/userController');
const { randomQuote } = require('../services/predictionService');

router.get('/quote', (_req, res) => res.json({ quote: randomQuote() }));
router.get('/',      getUsers);
router.post('/',     createUser);

module.exports = router;
