import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://erp.pay2all.in/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add the access token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for interceptor', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    // We accept only the success data implicitly everywhere in the app
    return response.data;
  },
  async (error) => {
    // Global error handler to show a toast every time a query/mutation fails
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.log("Axios", errorMessage);


    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear token, logout user)
      console.log('Unauthorized access - potentially redirect to login');
      await SecureStore.deleteItemAsync('access_token');
      // Ideally, trigger a state update here to force redirect to sign-in
    }
    return Promise.reject(error);
  }
);

export default apiClient;
