import axios from 'axios';

const newsApiConfig = {
  baseUrl: 'https://newsdata.io/api/1/news',
  params: {
    apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
    language: 'en',
    category: 'business'
  }
};

export const fetchNews = async (category = 'cryptocurrency', count = 6) => {
  try {
    const { data } = await axios.get(newsApiConfig.baseUrl, {
      params: {
        ...newsApiConfig.params,
        q: category,
        size: count
      }
    });

    if (!data.results) {
      throw new Error('No news found');
    }

    return data.results;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};