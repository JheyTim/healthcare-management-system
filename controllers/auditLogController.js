const AuditLog = require('../models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error });
  }
};
