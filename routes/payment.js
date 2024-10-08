const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { processPayment } = require('../controllers/paymentController');

router.post('/pay', authMiddleware, processPayment);

module.exports = router;
