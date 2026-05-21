import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'https://dev-api.pay2all.in/'; // Adjust if different

const Axios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Postman collection shows formdata in some requests, 
      // but Axios can usually handle objects and auto-convert or we pass FormData instances.
      // If the API requires multipart/form-data for normal JSON logic, we might need to adjust content-type.
    } catch (error) {
      console.error('Error fetching token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
