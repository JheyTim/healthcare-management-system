const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const logger = require('../utils/logger');
const sendEmail = require('../utils/email');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Failed login attempt: No user found for email ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Failed login attempt: Invalid password for user ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    logger.info(`User ${email} logged in successfully`);

    // Generate a 2FA code and send it via email
    const token = speakeasy.totp({
      secret: process.env.TOTP_SECRET,
      encoding: 'base32',
    });

    sendEmail(user.email, 'Your 2FA Code', `Your 2FA code is: ${token}`);

    res.json({
      message: '2FA code sent. Please check your email.',
      userId: user._id,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.verify2FA = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const verified = speakeasy.totp.verify({
      secret: process.env.TOTP_SECRET,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA code' });
    }

    const user = await User.findById(userId);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: '2FA verification failed', error });
  }
};
