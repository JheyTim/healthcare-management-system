const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAllAuditLogs,
  exportCsv,
  exportPdf,
} = require('../controllers/auditLogController');

// Get all audit logs (Admins)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllAuditLogs);

// Export audit logs as CSV (Admins only)
router.get('/export-csv', authMiddleware, roleMiddleware(['admin']), exportCsv);

// Export audit logs as PDF (Admins only)
router.get('/export-pdf', authMiddleware, roleMiddleware(['admin']), exportPdf);
module.exports = router;
