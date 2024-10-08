const Billing = require('../models/billing');

// Create a new bill (Doctors)
exports.createBill = async (req, res) => {
  const { patientId, doctorId, amount, serviceDescription } = req.body;

  try {
    const billing = new Billing({
      patient: patientId,
      doctor: doctorId,
      amount,
      serviceDescription,
    });

    await billing.save();
    res.status(201).json(billing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill', error });
  }
};

// Get all bills for a doctor (Doctors)
exports.getAllBillsForDoctor = async (req, res) => {
  try {
    const bills = await Billing.find({ doctor: req.params.doctorId });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }
};

// Get all bills for a patient (Patients)
exports.getAllBillsForPatient = async (req, res) => {
  try {
    const bills = await Billing.find({ patient: req.params.patientId });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }
};

// Update bill status (Patients)
exports.updateBill = async (req, res) => {
  const { status, paymentDate } = req.body;

  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    billing.status = status || billing.status;
    billing.paymentDate = paymentDate || billing.paymentDate;

    await billing.save();
    res.json(billing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bill', error });
  }
};

// Delete a bill (Doctors)
exports.deleteBill = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    await Billing.deleteOne({ _id: req.params.id });
    res.json({ message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bill', error });
  }
};
