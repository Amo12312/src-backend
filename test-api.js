// Test script for API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL

async function testAPI() {
  try {
    // Test health check
    console.log('Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('Health check response:', healthResponse.data);

    // Test subscription creation
    console.log('\nTesting subscription creation...');
    const subscriptionData = {
      amount: 1000,
      name: 'Test User',
      email: 'test@example.com',
      contact: '1234567890'
    };

    const subscriptionResponse = await axios.post(`${BASE_URL}/create-subscription`, subscriptionData);
    console.log('Subscription response:', subscriptionResponse.data);

  } catch (error) {
    console.error('Error testing API:', error.response?.data || error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 