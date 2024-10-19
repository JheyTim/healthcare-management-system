const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { retrieveMessageHistory } = require('../controllers/messageController');

router.get('/:userId/:contactId', authMiddleware, retrieveMessageHistory);

module.exports = router;
