import axios from "axios";
import NodeCache from "node-cache";

// Create cache with 1 hour TTL (3600 seconds)
const apiCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Helper function to get cached data or return null
const getCachedData = (key) => {
  try {
    return apiCache.get(key);
  } catch (error) {
    console.error(`Cache error for ${key}:`, error);
    return null;
  }
};

// Get coin market data using CoinGecko API
export const getCoinData = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 100;
    const cacheKey = `coins-${count}`;
    
    // Check cache BEFORE making API calls
    const cachedCoins = getCachedData(cacheKey);
    if (cachedCoins && !req.query.forceRefresh) {
      console.log("Using cached coin data");
      return res.status(200).json({
        data: cachedCoins.data,
        cachedAt: cachedCoins.timestamp
      });
    }
    
    console.log("Fetching fresh coin data from CoinGecko");
    
    // CoinGecko: /coins/markets
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: count,
        page: 1,
        sparkline: false
      }
    });

    const coins = response.data.map(coin => ({
      uuid: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      numberOfMarkets: 0,
      numberOfExchanges: 0,
      iconUrl: coin.image,
      change: coin.price_change_percentage_24h,
      rank: coin.market_cap_rank
    }));

    // Cache the successful response
    apiCache.set(cacheKey, {
      data: coins,
      timestamp: new Date().toISOString()
    });

    res.status(200).json(coins);
  } catch (error) {
    console.error("Error fetching coins:", error.message);
    
    // Try to get cached data
    const cacheKey = `coins-${req.query.count || 100}`;
    const cachedCoins = getCachedData(cacheKey);
    if (cachedCoins) {
      return res.status(200).json({
        data: cachedCoins.data,
        isFallbackData: true,
        cachedAt: cachedCoins.timestamp
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Get details for a specific coin using CoinGecko API
export const getCoinDetails = async (req, res) => {
  try {
    const { coinId } = req.params;
    
    // CoinGecko: /coins/{id}
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });

    const coin = response.data;
    if (!coin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    // Create detailed coin object
    const coinDetails = {
      uuid: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.market_data.current_price.usd,
      marketCap: coin.market_data.market_cap.usd,
      volume24h: coin.market_data.total_volume.usd,
      rank: coin.market_cap_rank,
      numberOfMarkets: 0,
      numberOfExchanges: 0,
      iconUrl: coin.image.large,
      supply: {
        confirmed: true,
        total: coin.market_data.total_supply,
        circulating: coin.market_data.circulating_supply
      },
      description: coin.description.en
    };
    
    res.status(200).json(coinDetails);
  } catch (error) {
    console.error("Error fetching coin details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch global stats using CoinGecko API
export const getGlobalStats = async (req, res) => {
  try {
    const cachedStats = getCachedData('global-stats');
    if (cachedStats && !req.query.forceRefresh) {
      console.log("Using cached global stats");
      return res.status(200).json({
        ...cachedStats,
        cachedAt: cachedStats.timestamp
      });
    }
    
    console.log("Fetching fresh global stats from CoinGecko");
    
    // CoinGecko: /global
    const response = await axios.get("https://api.coingecko.com/api/v3/global");
    const data = response.data.data;

    const globalStats = {
      total: data.active_cryptocurrencies,
      totalExchanges: data.markets,
      totalMarketCap: data.total_market_cap.usd,
      total24hVolume: data.total_volume.usd,
      totalMarkets: data.markets,
      timestamp: new Date().toISOString()
    };

    // Cache the successful response
    apiCache.set('global-stats', globalStats);

    res.status(200).json(globalStats);
  } catch (error) {
    console.error("Error fetching global stats:", error);
    
    // Try to get cached data
    const cachedStats = getCachedData('global-stats');
    if (cachedStats) {
      return res.status(200).json({
        ...cachedStats,
        isFallbackData: true,
        cachedAt: cachedStats.timestamp
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Optimized getCryptoNews that checks cache first
export const getCryptoNews = async (req, res) => {
  try {
    const { category = 'cryptocurrency', count = 10, sentiment = null } = req.query;
    const cacheKey = `news-${category}-${count}-${sentiment || 'all'}`;

    const cachedNews = getCachedData(cacheKey);
    if (cachedNews && !req.query.forceRefresh) {
      console.log("Using cached news data");
      return res.status(200).json({
        data: cachedNews.data,
        cachedAt: cachedNews.timestamp
      });
    }
    
    console.log("Fetching fresh news data with API key:", 
      process.env.NEWSDATA_API_KEY ? "Key exists" : "Key missing");
    
    // Create search query for the API
    const searchQuery = `${category} AND (crypto OR blockchain OR cryptocurrency)`;
    
    const params = {
      apikey: process.env.NEWSDATA_API_KEY,
      language: "en",
      q: searchQuery,
      size: count,
      image: 1,
      removeduplicate: 1
    };
    
    // Add optional parameters
    if (sentiment) params.sentiment = sentiment;
    
    // Continue with API call only if cache miss or forced refresh
    const response = await axios.get("https://newsdata.io/api/1/news", { params });
    
    if (response.data.status !== "success") {
      // Try to get cached data as fallback
      if (cachedNews) {
        return res.status(200).json({
          data: cachedNews.data,
          isFallbackData: true,
          cachedAt: cachedNews.timestamp
        });
      }
      
      return res.status(500).json({ message: "Failed to fetch news" });
    }
    
    // Format the response
    const formattedNews = response.data.results.map(article => ({
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      link: article.link,
      image_url: article.image_url || null,
      source: article.source_id || 'Unknown Source',
      pubDate: article.pubDate || new Date().toISOString(),
      sentiment: article.sentiment || null,
      content: article.content || null
    }));
    
    // Cache the successful response
    apiCache.set(cacheKey, {
      data: formattedNews,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json(formattedNews);
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Try to get cached data as fallback
    const { category = 'cryptocurrency', count = 10, sentiment = null } = req.query;
    const cacheKey = `news-${category}-${count}-${sentiment || 'all'}`;
    const cachedNews = getCachedData(cacheKey);
    
    if (cachedNews) {
      return res.status(200).json({
        data: cachedNews.data,
        isFallbackData: true,
        cachedAt: cachedNews.timestamp
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Get coin history using CoinGecko API
export const getCoinHistory = async (req, res) => {
  try {
    const { coinId, timeperiod = '7d' } = req.params;
    const cacheKey = `history-${coinId}-${timeperiod}`;
    
    // Try to get cached data
    const cachedHistory = getCachedData(cacheKey);
    if (cachedHistory) {
      return res.status(200).json(cachedHistory);
    }
    
    // Map your time periods to CoinGecko format
    let days;
    if (timeperiod === '24h') days = 1;
    else if (timeperiod === '7d') days = 7;
    else if (timeperiod === '30d') days = 30;
    else if (timeperiod === '3m') days = 90;
    else if (timeperiod === '1y') days = 365;
    else days = 7; // Default
    
    // First we need to map our coinId to CoinGecko's id system
    // For this example, we'll get the Bitcoin data if the mapping fails
    const coinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
    
    // Find coin by symbol (not perfect but workable)
    let geckoId = 'bitcoin'; // Default fallback
    const coinMatch = coinResponse.data.find(
      coin => coin.symbol.toLowerCase() === coinId.toLowerCase()
    );
    
    if (coinMatch) {
      geckoId = coinMatch.id;
    }
    
    // Get market chart data 
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days > 90 ? 'daily' : null // Use daily interval for long timeframes
        }
      }
    );
    
    if (!response.data || !response.data.prices) {
      return res.status(500).json({ message: "Failed to fetch historical data" });
    }
    
    // Format data to match your existing structure
    const history = response.data.prices.map(item => {
      return {
        timestamp: new Date(item[0]).toISOString(), // Convert timestamp to ISO string
        price: item[1]
      };
    });
    
    // Calculate percentage change
    const startPrice = history[0].price;
    const endPrice = history[history.length - 1].price;
    const change = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
    
    const historyData = {
      change,
      history
    };
    
    // Cache the successful response
    apiCache.set(cacheKey, historyData);
    
    res.status(200).json(historyData);
  } catch (error) {
    console.error("Error fetching coin history:", error);
    res.status(500).json({ message: error.message });
  }
};
