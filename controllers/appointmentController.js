const Appointment = require('../models/appointment');
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');
const logAction = require('../utils/auditLogger');
const logger = require('../utils/logger');

// Schedule a new appointment (Patients)
exports.createAppointment = async (req, res) => {
  const { doctorId, patientId, date, reason } = req.body;

  try {
    const appointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date,
      reason,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling appointment', error });
  }
};

// Get all appointments for a doctor (Doctors)
exports.getAllAppointmentsForDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Get all appointments for a patient (Patients)
exports.getAllAppointmentForPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId,
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Update appointment status (Doctors)
exports.updateAppointment = async (req, res) => {
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient');

    if (!appointment) {
      logger.warn(
        `Attempt to update non-existing appointment ${req.params.id}`
      );
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    await appointment.save();

    // Log the update action
    logAction(req.user._id, 'UPDATE', 'appointment', appointment._id);

    const io = req.app.get('io');

    // Emit an event to the specific doctor and patient
    io.to(appointment.doctor._id.toString()).emit('appointmentStatusChanged', {
      appointmentId: appointment._id,
      status: appointment.status,
    });

    io.to(appointment.patient._id.toString()).emit('appointmentStatusChanged', {
      appointmentId: appointment._id,
      status: appointment.status,
    });

    // Send email notification to both the doctor and patient
    sendEmail(
      appointment.doctor.email,
      'Appointment Status Update',
      `Appointment ${appointment._id} status has been updated to ${status}.`
    );
    sendEmail(
      appointment.patient.email,
      'Appointment Status Update',
      `Your appointment ${appointment._id} status has been updated to ${status}.`
    );

    logger.info(
      `User ${req.user.email} updated appointment ${appointment._id} status to ${status}`
    );

    // Send SMS notifications to both the doctor and patient
    sendSMS(
      appointment.doctor.phone,
      `Appointment ${appointment._id} status has been updated to ${status}.`
    );
    sendSMS(
      appointment.patient.phone,
      `Your appointment ${appointment._id} status has been updated to ${status}.`
    );

    res.json(appointment);
  } catch (error) {
    logger.error(`Error updating appointment: ${error.message}`);
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment (Doctors or Patients)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};
