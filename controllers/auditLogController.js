const fs = require('fs');
const PDFDocument = require('pdfkit');
const fastcsv = require('fast-csv');
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

exports.exportCsv = async (req, res) => {
  const { user, action, resource } = req.query;

  let query = {};
  if (user) query.user = user;
  if (action) query.action = action;
  if (resource) query.resource = resource;

  try {
    const logs = await AuditLog.find(query).populate('user');

    // Create CSV file
    const ws = fs.createWriteStream('audit_logs.csv');
    fastcsv
      .write(
        logs.map((log) => ({
          user: log.user._id,
          action: log.action,
          resource: log.resource,
          resourceId: log.resourceId,
          timestamp: log.timestamp,
        })),
        { headers: true }
      )
      .pipe(ws)
      .on('finish', () => {
        // Send the CSV file to the client
        res.download('audit_logs.csv');
      });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting logs to CSV', error });
  }
};

exports.exportPdf = async (req, res) => {
  const { user, action, resource } = req.query;

  let query = {};
  if (user) query.user = user;
  if (action) query.action = action;
  if (resource) query.resource = resource;

  try {
    const logs = await AuditLog.find(query).populate('user');

    // Create a PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Audit Logs Report', { align: 'center' });
    doc.moveDown();

    logs.forEach((log) => {
      doc.fontSize(12).text(`User ID: ${log.user._id}`);
      doc.text(`Action: ${log.action}`);
      doc.text(`Resource: ${log.resource}`);
      doc.text(`Resource ID: ${log.resourceId}`);
      doc.text(`Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
      doc.moveDown();
    });

    doc.end(); // Finalize PDF file
  } catch (error) {
    res.status(500).json({ message: 'Error exporting logs to PDF', error });
  }
};
