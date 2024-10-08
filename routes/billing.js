const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createBill,
  getAllBillsForDoctor,
  getAllBillsForPatient,
  updateBill,
  deleteBill,
} = require('../controllers/billingController');

router.post('/', authMiddleware, createBill);
router.get('/doctor/:doctorId', authMiddleware, getAllBillsForDoctor);
router.get('/patient/:patientId', authMiddleware, getAllBillsForPatient);
router.put('/:id', authMiddleware, updateBill);
router.delete('/:id', authMiddleware, deleteBill);

module.exports = router;
