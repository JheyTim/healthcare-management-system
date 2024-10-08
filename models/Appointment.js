const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the doctor
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the patient
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'conpleted', 'cancelled'],
    default: 'pending',
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
