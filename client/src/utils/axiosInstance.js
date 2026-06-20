import axios from 'axios';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for sending/receiving HTTPOnly cookies
});

// Optional: Add request/response interceptors here if needed in the future
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors, e.g., redirect to login on 401
//     return Promise.reject(error);
//   }
// );
