const AuditLog = require('../models/AuditLog');

exports.logAction = async (userId, action, resource, resourceId) => {
  try {
    const log = new AuditLog({
      user: userId,
      action,
      resource,
      resourceId,
    });

    await log.save();
    console.log('Audit log recorded:', action);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
