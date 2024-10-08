const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

router.post('/', authMiddleware, createPatient);
router.get('/doctor/:doctorId', authMiddleware, getAllPatients);
router.get('/:id', authMiddleware, getPatient);
router.put('/:id', authMiddleware, updatePatient);
router.delete('/:id', authMiddleware, deletePatient);

module.exports = router