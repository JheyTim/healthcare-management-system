const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Billing = require('../models/billing');

exports.processPayment = async (req, res) => {
  const { billingId, paymentMethodId } = req.body;

  try {
    const billing = await Billing.findById(billingId);

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

    // Emit event to notify payment processed
    io.emit('paymentProcessed', {
      billingId: billing._id,
      status: billing.status,
      amount: billing.amount,
    });

    res.json({ message: 'Payment successful', billing });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing error', error });
  }
};
