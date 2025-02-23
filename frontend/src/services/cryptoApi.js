import axios from 'axios';

const cryptoApiHeaders = {
  'apikey': import.meta.env.VITE_COINLAYER_API_KEY
};

const baseUrl = 'https://api.coinlayer.com';

export const fetchCoins = async (count) => {
  try {
    const listResponse = await axios.get(`${baseUrl}/list`, {
      headers: cryptoApiHeaders,
      params: {
        access_key: import.meta.env.VITE_COINLAYER_API_KEY
      }
    });

    if (!listResponse.data.success) {
      throw new Error(listResponse.data.error.info || 'Failed to fetch coin list');
    }

    const liveResponse = await axios.get(`${baseUrl}/live`, {
      headers: cryptoApiHeaders,
      params: {
        access_key: import.meta.env.VITE_COINLAYER_API_KEY
      }
    });

    if (!liveResponse.data.success) {
      throw new Error(liveResponse.data.error.info || 'Failed to fetch live rates');
    }

    const coins = Object.entries(listResponse.data.crypto)
      .slice(0, count)
      .map(([symbol, coin]) => ({
        ...coin,
        symbol,
        price: liveResponse.data.rates[symbol] || 0,
        marketCap: coin.max_supply * (liveResponse.data.rates[symbol] || 0),
        volume24h: liveResponse.data.rates[symbol] || 0,
        numberOfMarkets: 0,
        numberOfExchanges: 0
      }));

    return coins;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error; // Propagate error to component for proper handling
  }
};

export const fetchCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(`${baseUrl}/live?target=${coinId}`, {
      headers: cryptoApiHeaders
    });
    return response.data.crypto[coinId];
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
};