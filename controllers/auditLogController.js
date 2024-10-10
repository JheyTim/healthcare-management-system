const AuditLog = require('../models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
  const { user, action, resource } = req.query;

  let query = {};

  if (user) {
    query.user = user;
  }

  if (action) {
    query.action = action;
  }

  if (resource) {
    query.resource = resource;
  }

  try {
    const logs = await AuditLog.find(query).populate('user');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error });
  }
};
