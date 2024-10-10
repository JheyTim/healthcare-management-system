const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllAuditLogs } = require('../controllers/auditLogController');

// Get all audit logs (Admins)
router.get('/', authMiddleware, getAllAuditLogs);

module.exports = router;
