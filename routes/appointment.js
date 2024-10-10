const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createAppointment,
  getAllAppointmentsForDoctor,
  getAllAppointmentForPatient,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['patient']),
  createAppointment
);
router.get(
  '/doctor/:doctorId',
  authMiddleware,
  roleMiddleware(['doctor']),
  getAllAppointmentsForDoctor
);
router.get(
  '/patient/:patientId',
  authMiddleware,
  roleMiddleware(['patient']),
  getAllAppointmentForPatient
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['doctor']),
  updateAppointment
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['doctor', 'patient']),
  deleteAppointment
);

module.exports = router;
