const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send an SMS
const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // Recipient's phone number
    });

    console.log('SMS sent:', message.sid);
  } catch (error) {
    console.log('Error sending SMS:', error);
  }
};

module.exports = sendSMS;