const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'https://your-deployment-domain.com']; // Add production domain as needed

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// CORS middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
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
    const plan_id = process.env.RAZORPAY_PLAN_ID;
    if (!plan_id) {
      return res.status(500).json({ error: 'Plan ID not configured.' });
    }
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount for subscription.' });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
      quantity: amount,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
