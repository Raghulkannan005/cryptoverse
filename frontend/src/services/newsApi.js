import axios from 'axios';

const newsApiConfig = {
  baseUrl: 'https://newsdata.io/api/1/news',
  params: {
    apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
    language: 'en',
  }
};

/**
 * @param {Object} options - The options for fetching news
 * @param {string} [options.category='cryptocurrency'] - Search category
 * @param {number} [options.count=10] - Number of articles to fetch
 * @param {string} [options.coin] - Specific crypto coin(s) to fetch news for (e.g., 'btc,eth')
 * @param {string} [options.sentiment] - Filter by sentiment (positive/negative/neutral)
 */
export const fetchNews = async ({
  category = 'cryptocurrency',
  count = 10,
  sentiment
} = {}) => {
  try {
    // Validate parameters
    if (count < 1 || count > 10) {
      console.log(count)
      throw new Error('Count must be between 1 and 10');
    }

    // Create search query - only use one query parameter as required by API
    const searchQuery = `${category} AND (crypto OR blockchain OR cryptocurrency)`;

    const params = {
      ...newsApiConfig.params,
      q: searchQuery, // Use single query parameter with AND/OR operators
      size: count,
      image: 1,
      removeduplicate: 1
    };

    // Add optional parameters
    if (sentiment) params.sentiment = sentiment;

    const { data } = await axios.get(newsApiConfig.baseUrl, { params });

    if (data.status === 'error') {
      if (data.results?.code === 'Unauthorized') {
        throw new Error('API access denied. Please check your subscription plan.');
      }
      const errorMessage = data.results?.message || 'Failed to fetch news';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('No news articles found');
    }

    // Format the response
    return data.results.map(article => ({
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      link: article.link,
      image_url: article.image_url || null,
      source: article.source_id || 'Unknown Source',
      pubDate: article.pubDate || new Date().toISOString(),
      sentiment: article.sentiment || null,
      content: article.content || null
    }));

  } catch (error) {
    console.error('Error fetching news:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid API key. Please check your configuration.');
        case 402:
          throw new Error('Subscription plan upgrade required for this feature.');
        case 422:
          throw new Error('Invalid API parameters. Please check your search terms.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        default:
          throw new Error(`API Error: ${error.response.data?.message || error.message}`);
      }
    }
    throw error;
  }
};