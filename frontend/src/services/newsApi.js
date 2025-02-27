import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Create a function to get the current token
const getAuthToken = () => localStorage.getItem('token');

export const fetchNews = async ({
  category = 'cryptocurrency',
  count = 10,
  sentiment
} = {}) => {
  try {
    let url = `${API_URL}/cryptos/news?category=${category}&count=${count}`;
    
    if (sentiment) {
      url += `&sentiment=${sentiment}`;
    }
    
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};