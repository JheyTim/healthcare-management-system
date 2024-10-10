const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllAuditLogs } = require('../controllers/auditLogController');

// Get all audit logs (Admins)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllAuditLogs);

module.exports = router;
