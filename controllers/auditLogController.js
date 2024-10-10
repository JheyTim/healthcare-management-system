const AuditLog = require('../models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
  const { user, action, resource, page = 1, limit = 10 } = req.query;

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
    const logsPromise = AuditLog.find(query)
      .populate('user')
      .skip((page - 1) * limit)
      .limit(+limit);

    const totalLogsPromise = AuditLog.countDocuments(query); // Total log count for pagination

    const [logs, totalLogs] = await Promise.all([
      logsPromise,
      totalLogsPromise,
    ]);

    res.json({
      logs,
      totalLogs,
      currentPage: +page,
      totalPages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error });
  }
};
