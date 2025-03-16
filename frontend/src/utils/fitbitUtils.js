import axios from 'axios';

const API_BASE_URL = 'https://hm-0023-mle.vercel.app/api/fitbit';

export const fitbitUtils = {
  // Initialize Fitbit connection
  connect: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to initialize Fitbit connection');
    }
  },

  // Fetch Fitbit data
  getFitbitData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Fitbit data');
    }
  },

  // Check connection status
  checkConnection: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return { connected: false };
    }
  }
};

export default fitbitUtils; 