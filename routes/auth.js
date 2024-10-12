const router = require('express').Router();
const { register, login, verify2FA } = require('../controllers/authController');

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Verify 2FA Code
router.post('/verify-2fa', verify2FA);

module.exports = router;
