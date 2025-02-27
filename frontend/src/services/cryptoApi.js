import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Create a function to get the current token (dynamic)
const getAuthToken = () => localStorage.getItem('token');

export const fetchCoins = async (count) => {
  try {
    const { data } = await axios.get(`${API_URL}/cryptos/coins?count=${count}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

// Add the missing fetchCoinDetails function
export const fetchCoinDetails = async (coinId) => {
  try {
    const { data } = await axios.get(`${API_URL}/cryptos/coin/${coinId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

// Other functions remain the same