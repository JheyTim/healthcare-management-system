const Patient = require('../models/Patient');
const logAction = require('../utils/auditLogger');

// Create a new patient record (Only for doctors)
exports.createPatient = async (req, res) => {
  const { name, age, medicalHistory, prescriptions, doctorId } = req.body;

  try {
    const patient = new Patient({
      name,
      age,
      medicalHistory,
      prescriptions,
      doctor: doctorId,
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating patient record', error });
  }
};

// Get all patients records for a doctor (Only for doctors)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ doctor: req.params.doctorId });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient records', error });
  }
};

// Get a specific patient record (For doctor or patient)
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient record', error });
  }
};

// Update a patient record (Only for doctors)
exports.updatePatient = async (req, res) => {
  const { name, age, medicalHistory, prescriptions } = req.body;

  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.name = name || patient.name;
    patient.age = age || patient.age;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.prescriptions = prescriptions || patient.prescriptions;

    await patient.save();

    // Log the update action
    logAction(req.user._id, 'UPDATE', 'patient', patient._id);

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient record', error });
  }
};

// Delete a patient record (Only for doctors)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await Patient.deleteOne({ _id: req.params.id });
    res.json({ message: 'Patient record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient record', error });
  }
};
