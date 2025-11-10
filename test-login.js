const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'teacher@dau.edu.vn',
      password: 'teacher123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token.substring(0, 30) + '...');
    console.log('User:', response.data.data.name, `(${response.data.data.role})`);
  } catch (error) {
    console.log('❌ Login failed:', error.response?.status, error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data);
  }
}

testLogin();
