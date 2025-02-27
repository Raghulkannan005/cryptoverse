import axios from "axios";
import User from "../models/userModel.js";
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

// Fetch all coins with pagination
export const getCoinData = async (req, res) => {
  try {
    const count = req.query.count || 100;
    
    console.log("Fetching coin data with API key:", process.env.COINLAYER_API_KEY ? "Key exists" : "Key missing");
    
    // Get coin list
    const listResponse = await axios.get("https://api.coinlayer.com/list", {
      params: { access_key: process.env.COINLAYER_API_KEY },
    });
    
    // Get live rates
    const liveResponse = await axios.get("https://api.coinlayer.com/live", {
      params: { access_key: process.env.COINLAYER_API_KEY },
    });
    
    if (!listResponse.data.success || !liveResponse.data.success) {
      if (listResponse.data.error) {
        console.error("List API error:", listResponse.data.error);
      }
      if (liveResponse.data.error) {
        console.error("Live API error:", liveResponse.data.error);
      }
      
      // Try to get cached data
      const cacheKey = `coins-${count}`;
      const cachedCoins = getCachedData(cacheKey);
      if (cachedCoins) {
        return res.status(200).json({
          data: cachedCoins.data,
          isFallbackData: true,
          cachedAt: cachedCoins.timestamp
        });
      }
      
      return res.status(500).json({ message: "Failed to fetch cryptocurrency data" });
    }
    
    const cryptos = listResponse.data.crypto || {};
    const rates = liveResponse.data.rates || {};
    
    // Format the response to match what frontend expects
    const coins = Object.entries(cryptos)
      .slice(0, count)
      .map(([symbol, coin]) => ({
        ...coin,
        symbol,
        price: rates[symbol] || 0,
        marketCap: coin.max_supply ? coin.max_supply * (rates[symbol] || 0) : 0,
        volume24h: rates[symbol] || 0,
        numberOfMarkets: 0,
        numberOfExchanges: 0
      }));
    
    // Cache the successful response
    const cacheKey = `coins-${count}`;
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

// Get details for a specific coin
export const getCoinDetails = async (req, res) => {
  try {
    const { coinId } = req.params;
    
    // Get coin list for metadata
    const listResponse = await axios.get("https://api.coinlayer.com/list", {
      params: { access_key: process.env.COINLAYER_API_KEY },
    });
    
    // Get live rates
    const liveResponse = await axios.get("https://api.coinlayer.com/live", {
      params: { 
        access_key: process.env.COINLAYER_API_KEY,
        symbols: coinId
      },
    });
    
    if (!listResponse.data.success || !liveResponse.data.success) {
      return res.status(500).json({ message: "Failed to fetch coin details" });
    }
    
    const coinInfo = listResponse.data.crypto[coinId];
    const price = liveResponse.data.rates[coinId] || 0;
    
    if (!coinInfo) {
      return res.status(404).json({ message: "Coin not found" });
    }
    
    // Create detailed coin object
    const coinDetails = {
      ...coinInfo,
      symbol: coinId,
      price,
      marketCap: coinInfo.max_supply ? coinInfo.max_supply * price : 0,
      volume24h: price, // Simplification
      rank: 0, // Not available from coinlayer
      numberOfMarkets: 0, // Not available from coinlayer
      numberOfExchanges: 0, // Not available from coinlayer
      supply: {
        confirmed: true,
        total: coinInfo.max_supply || 0,
        circulating: coinInfo.max_supply || 0 // Simplification
      }
    };
    
    res.status(200).json(coinDetails);
  } catch (error) {
    console.error("Error fetching coin details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch global stats
export const getGlobalStats = async (req, res) => {
  try {
    console.log("Fetching global stats with API key:", process.env.COINLAYER_API_KEY ? "Key exists" : "Key missing");
    
    // Get coin list
    const listResponse = await axios.get("https://api.coinlayer.com/list", {
      params: { access_key: process.env.COINLAYER_API_KEY },
    });
    
    // Get live rates
    const liveResponse = await axios.get("https://api.coinlayer.com/live", {
      params: { access_key: process.env.COINLAYER_API_KEY },
    });
    
    if (!listResponse.data.success || !liveResponse.data.success) {
      if (listResponse.data.error) {
        console.error("List API error:", listResponse.data.error);
      }
      if (liveResponse.data.error) {
        console.error("Live API error:", liveResponse.data.error);
      }
      
      // Try to get cached data
      const cachedStats = getCachedData('global-stats');
      if (cachedStats) {
        return res.status(200).json({
          ...cachedStats,
          isFallbackData: true,
          cachedAt: cachedStats.timestamp
        });
      }
      
      return res.status(500).json({ message: "Failed to fetch cryptocurrency data" });
    }
    
    const cryptos = listResponse.data.crypto || {};
    const rates = liveResponse.data.rates || {};
    
    // Calculate global stats
    const totalCoins = Object.keys(cryptos).length;
    let totalMarketCap = 0;
    let total24hVolume = 0;
    
    Object.entries(cryptos).forEach(([symbol, coin]) => {
      const price = rates[symbol] || 0;
      if (coin.max_supply && price) {
        totalMarketCap += coin.max_supply * price;
      }
      total24hVolume += price; // This is a simplification
    });
    
    const globalStats = {
      total: totalCoins,
      totalExchanges: 10, // Placeholder
      totalMarketCap,
      total24hVolume,
      totalMarkets: 100, // Placeholder
      timestamp: new Date().toISOString() // Add timestamp
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

// Fetch crypto news
export const getCryptoNews = async (req, res) => {
  try {
    const { category = 'cryptocurrency', count = 10, sentiment = null } = req.query;
    const cacheKey = `news-${category}-${count}-${sentiment || 'all'}`;
    
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
    
    const response = await axios.get("https://newsdata.io/api/1/news", { params });
    
    if (response.data.status !== "success") {
      // Try to get cached data
      const cachedNews = getCachedData(cacheKey);
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
    
    // Try to get cached data
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

// Add a coin to watchlist
export const addToWatchList = async (req, res) => {
  try {
    const { coinId } = req.body;
    
    if (!coinId) {
      return res.status(400).json({ message: "Coin ID is required" });
    }
    
    // Get user from middleware
    const userId = req.user.id;
    
    // Find if user already has a watchlist
    let userWatchlist = await Watchlist.findOne({ user: userId });
    
    if (userWatchlist) {
      // Check if coin already exists in watchlist
      if (userWatchlist.coins.includes(coinId)) {
        return res.status(400).json({ message: "Coin already in watchlist" });
      }
      
      // Add coin to existing watchlist
      userWatchlist.coins.push(coinId);
      await userWatchlist.save();
    } else {
      // Create new watchlist for user
      userWatchlist = new Watchlist({
        user: userId,
        coins: [coinId]
      });
      await userWatchlist.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Coin added to watchlist",
      watchlist: userWatchlist.coins
    });
    
  } catch (error) {
    console.error("Error in addToWatchList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's watchlist
export const getWatchList = async (req, res) => {
  try {
    // Get user from middleware
    const userId = req.user.id;
    
    // Find user's watchlist
    const userWatchlist = await Watchlist.findOne({ user: userId });
    
    if (!userWatchlist) {
      return res.status(200).json({ coins: [] });
    }
    
    // Get detailed info for each coin in the watchlist
    const watchlistCoins = [];
    
    // If you're storing coin data in your own database
    for (const coinId of userWatchlist.coins) {
      try {
        const coinData = await getCoinDataById(coinId); // Implement this function to fetch coin data
        if (coinData) {
          watchlistCoins.push(coinData);
        }
      } catch (err) {
        console.error(`Error fetching coin data for ${coinId}:`, err);
      }
    }
    
    res.status(200).json({ coins: watchlistCoins });
    
  } catch (error) {
    console.error("Error in getWatchList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a coin from watchlist
export const removeFromWatchList = async (req, res) => {
  try {
    const { coinId } = req.body;
    
    if (!coinId) {
      return res.status(400).json({ message: "Coin ID is required" });
    }
    
    // Get user from middleware
    const userId = req.user.id;
    
    // Find user's watchlist
    const userWatchlist = await Watchlist.findOne({ user: userId });
    
    if (!userWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }
    
    // Remove coin from watchlist
    userWatchlist.coins = userWatchlist.coins.filter(coin => coin !== coinId);
    await userWatchlist.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Coin removed from watchlist",
      watchlist: userWatchlist.coins
    });
    
  } catch (error) {
    console.error("Error in removeFromWatchList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to get coin data by ID
const getCoinDataById = async (coinId) => {
  // Implement this based on your data source
  // This could fetch from your own database or an external API
  try {
    const { data } = await axios.get(`${API_URL}/coins/${coinId}`);
    return data;
  } catch (err) {
    console.error(`Error fetching coin data for ${coinId}:`, err);
    return null;
  }
};