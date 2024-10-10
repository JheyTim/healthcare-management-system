const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createBill,
  getAllBillsForDoctor,
  getAllBillsForPatient,
  updateBill,
  deleteBill,
} = require('../controllers/billingController');

router.post('/', authMiddleware, roleMiddleware(['doctor']), createBill);
router.get(
  '/doctor/:doctorId',
  authMiddleware,
  roleMiddleware(['doctor']),
  getAllBillsForDoctor
);
router.get(
  '/patient/:patientId',
  authMiddleware,
  roleMiddleware(['patient']),
  getAllBillsForPatient
);
router.put('/:id', authMiddleware, roleMiddleware(['patient']), updateBill);
router.delete('/:id', authMiddleware, roleMiddleware(['doctor']), deleteBill);

module.exports = router;
