# Healthcare Management System
## Overview
The Secure Healthcare Management System is a full-featured application designed to streamline healthcare services. It allows patients and healthcare providers to manage appointments, securely exchange documents, track billing and payments, and communicate in real time. The system is built with advanced security measures, including Two-Factor Authentication (2FA), role-based access control (RBAC), and audit logging for compliance and monitoring purposes.

## Features
* Authentication & Authorization:
  * JWT-based authentication.
  * Two-Factor Authentication (2FA) via email or authentication apps (e.g., Google Authenticator).

* Patient Record Management:
  * CRUD operations for patient records with encryption of sensitive data (medical history, prescriptions).

* Appointment Scheduling:
  * Patients can schedule appointments with healthcare providers.
  * Doctors can update appointment statuses and cancel appointments.
  * Real-time notifications for appointment updates.

* Billing and Payment Integration:
  * Doctors can create and manage bills for healthcare services.
  * Patients can make payments using Stripe.
  * Real-time notifications for payment confirmations.

* Audit Logging:
  * Track user actions and system events.
  * Searchable, filterable audit logs with export options (CSV, PDF).
  * Automated log cleanup and role-based access for viewing logs.

* Document Management:
  * Upload, store, and retrieve patient-related documents (e.g., medical reports, test results).

* Real-Time Messaging and Notifications:
  * Real-time chat between patients and doctors.
  * Notifications for new messages, document uploads, and appointment updates.
 
## Tech Stack
* **Backend**: Node.js, Express, MongoDB, Mongoose
* **Authentication**: JWT, Bcrypt, Speakeasy (for 2FA)
* **Payments**: Stripe API
* **File Uploads**: Multer
* **Real-Time Communication**: Socket.IO
* **Logging**: Winston, node-cron (for log cleanup)

## Getting Started
### Prerequisites
Make sure you have the following installed on your system:

* **Node.js** (v12 or higher)
* **MongoDB** (local instance or cloud-based MongoDB)
* **Stripe** (for payment integration)

### Installation
1. Clone the repository:
   ```bash
   https://github.com/JheyTim/healthcare-management-system.git
   cd healthcare-management-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a .env file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/healthcare
   JWT_SECRET=your_jwt_secret
   ENCRYPTION_KEY=your_key
   STRIPE_SECRET_KEY=your_stripe_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_password
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   TOTP_SECRET=your_totp_key
   ```
4. Start the application:
   ```bash
   npm start
   ```
## License
This project is licensed under the [MIT License](LICENSE).
