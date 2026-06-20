import axios from 'axios';

// Test with a token you have
const token = localStorage.getItem('adminToken');
if (!token) {
  console.error('No token in localStorage. Please login first.');
} else {
  // Test the endpoint
  axios.get('http://localhost:5000/api/admin/services', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => console.log('Success:', res.data))
  .catch(err => {
    console.error('Status:', err.response?.status);
    console.error('Data:', err.response?.data);
    console.error('Headers:', err.response?.headers);
  });
}
