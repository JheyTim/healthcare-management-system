require('dotenv').config();
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const cron = require('node-cron');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');
const billingRoutes = require('./routes/billing');
const paymentRoutes = require('./routes/payment');
const auditRoutes = require('./routes/auditLog');
const errorHandler = require('./middleware/errorHandler');
const AuditLog = require('./models/AuditLog');

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/audit', auditRoutes);
app.use(errorHandler);

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for the user joining their personal room
  socket.on('joinRoom', (userId) => {
    socket.join(userId); // The user joins a room based on their ID
    console.log(`User with ID ${userId} joined their room`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Emit updates
app.set('io', io);

// Cron job to delete old audit logs (older than 6 months)
cron.schedule('0 0 * * *', async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  try {
    const result = await AuditLog.deleteMany({
      timestamp: { $lt: sixMonthsAgo },
    });
    console.log(`Deleted ${result.deletedCount} old audit logs.`);
  } catch (error) {
    console.error('Error deleting old audit logs:', error);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
