const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Billing = require('../models/billing');
const sendSMS = require('../utils/sms');
const sendEmail = require('../utils/email');

exports.processPayment = async (req, res) => {
  const { billingId, paymentMethodId } = req.body;

  try {
    const billing = await Billing.findById(billingId)
      .populate('doctor')
      .populate('patient');

    if (!billing || billing.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid bill or already paid' });
    }

    // Create a Payment Intent
    await stripe.paymentIntents.create({
      amount: billing.amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      description: billing.serviceDescription,
      confirm: true, // Immediately confirm the payment intent
    });

    // Update the billing status if payment is successful
    billing.status = 'paid';
    billing.paymentDate = new Date();
    await billing.save();

    const io = req.app.get('io');

    // Emit an event to the specific doctor and patient
    io.to(billing.doctor._id.toString()).emit('paymentProcessed', {
      billingId: billing._id,
      status: billing.status,
      amount: billing.amount,
    });

    io.to(billing.patient._id.toString()).emit('paymentProcessed', {
      billingId: billing._id,
      status: billing.status,
      amount: billing.amount,
    });

    // Send email notification to both the doctor and patient
    sendEmail(
      billing.doctor.email,
      'Payment Processed',
      `Payment for bill ${billing._id} has been processed.`
    );
    sendEmail(
      billing.patient.email,
      'Payment Confirmation',
      `Your payment for bill ${billing._id} has been successfully processed.`
    );

    // Send SMS notifications to both the doctor and patient
    sendSMS(
      billing.doctor.phone,
      `Payment for bill ${billing._id} has been processed.`
    );
    sendSMS(
      billing.patient.phone,
      `Your payment for bill ${billing._id} has been successfully processed.`
    );

    res.json({ message: 'Payment successful', billing });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing error', error });
  }
};
