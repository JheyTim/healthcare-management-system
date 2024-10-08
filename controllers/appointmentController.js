const Appointment = require('../models/appointment');

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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
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
