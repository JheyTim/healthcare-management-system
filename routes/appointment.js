const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAllAppointmentsForDoctor,
  getAllAppointmentForPatient,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.post('/', authMiddleware, createAppointment);
router.get('/doctor/:doctorId', authMiddleware, getAllAppointmentsForDoctor);
router.get('/patient/:patientId', authMiddleware, getAllAppointmentForPatient);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;
