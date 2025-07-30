// backend/server.js
// Main server file for Hostinger deployment
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // or '*' for all origins (not recommended for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // if you need to send cookies
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Rewiametta Backend API is running!' });
});

// POST /create-subscription
app.post('/create-subscription', async (req, res) => {
  const { amount, name, email, contact } = req.body;
  try {
    // For recurring payments, the plan should be set to 1 INR/month in Razorpay dashboard.
    // 'quantity' will multiply the plan amount.
    const plan_id = process.env.RAZORPAY_PLAN_ID;
    if (!plan_id) {
      return res.status(500).json({ error: 'Plan ID not configured.' });
    }
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount for subscription.' });
    }
    // Create subscription with quantity = selectedAmount
    const subscription = await razorpay.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12, // 12 months
      quantity: amount, // User-selected monthly donation amount (multiplies plan amount)
      notes: {
        donor_name: name,
        donor_email: email,
        donor_contact: contact,
        donor_amount: amount,
      },
    });
    res.json({ subscription_id: subscription.id });
  } catch (err) {
    console.error('Subscription creation error:', err);
    // Razorpay error details
    if (err.error && err.error.description) {
      return res.status(400).json({ error: err.error.description });
    }
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});