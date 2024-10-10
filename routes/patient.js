const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

router.post('/', authMiddleware, roleMiddleware(['doctor']), createPatient);
router.get(
  '/doctor/:doctorId',
  authMiddleware,
  roleMiddleware(['doctor']),
  getAllPatients
);
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['doctor', 'patient']),
  getPatient
);
router.put('/:id', authMiddleware, roleMiddleware(['doctor']), updatePatient);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['doctor']),
  deletePatient
);

module.exports = router;
