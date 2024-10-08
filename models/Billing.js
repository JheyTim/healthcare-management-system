const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the patient
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the doctor
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  serviceDescription: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Billing', billingSchema);
