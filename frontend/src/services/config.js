export const cryptoApiConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  baseUrl: 'https://api.coinlayer.com',
  params: {
    access_key: import.meta.env.VITE_COINLAYER_API_KEY
  }
};