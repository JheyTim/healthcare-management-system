require('dotenv').config();
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');
const billingRoutes = require('./routes/billing');
const paymentRoutes = require('./routes/payment');

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

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for events like appointment status update or payment notification
  socket.on('appointmentStatusChanged', (data) => {
    io.emit('appointmentStatusChanged', data); // Notify all clients
  });

  socket.on('paymentProcessed', (data) => {
    io.emit('paymentProcessed', data); // Notify all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Emit updates
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
