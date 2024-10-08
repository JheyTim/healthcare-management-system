const mongoose = require('mongoose');
const crypto = require('crypto');

// Convert the 64-character hex string from the environment variable to a 32-byte buffer
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

//Encryption helper function
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // Generate random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Return IV and encrypted data
};

const decrypt = (text) => {
  const textParts = text.split(':'); // Split the IV and the encrypted text
  const iv = Buffer.from(textParts.shift(), 'hex'); // Extract IV
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    medicalHistory: {
      type: String,
      required: true,
      set: encrypt, // Encrypt the medical history before saving
      get: decrypt, // Decrypt the medical history when retrieving
    },
    prescriptions: {
      type: String,
      required: true,
      set: encrypt,
      get: decrypt,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the doctor
    },
  },
  { toJSON: { getters: true } }
);

module.exports = mongoose.model('Patient', patientSchema);
