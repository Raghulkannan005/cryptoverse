import axios from 'axios';
import { cryptoApiConfig } from './config';

export const fetchCoins = async (count) => {
  try {
    const { data: listData } = await axios.get(`${cryptoApiConfig.baseUrl}/list`, {
      headers: cryptoApiConfig.headers,
      params: cryptoApiConfig.params
    });

    if (!listData.success) {
      throw new Error(listData.error?.info || 'Failed to fetch coin list');
    }

    const { data: liveData } = await axios.get(`${cryptoApiConfig.baseUrl}/live`, {
      headers: cryptoApiConfig.headers,
      params: cryptoApiConfig.params
    });

    if (!liveData.success) {
      throw new Error(liveData.error?.info || 'Failed to fetch live rates');
    }

    const coins = Object.entries(listData.crypto)
      .slice(0, count)
      .map(([symbol, coin]) => ({
        ...coin,
        symbol,
        price: liveData.rates[symbol] || 0,
        marketCap: coin.max_supply * (liveData.rates[symbol] || 0),
        volume24h: liveData.rates[symbol] || 0,
        numberOfMarkets: 0,
        numberOfExchanges: 0
      }));

    return coins;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
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