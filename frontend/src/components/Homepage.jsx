import  { useState, useEffect } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';
import Spinner from './Spinner';
import axios from 'axios';

const Homepage = () => {
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    totalExchanges: 0,
    total24hVolume: 0,
    totalMarkets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [fallbackTimestamp, setFallbackTimestamp] = useState(null);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);
        console.log("Attempting to fetch global stats...");
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cryptos/global-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Global stats received:", data);
        
        // Check if we're receiving fallback data
        if (data.isFallbackData) {
          setUsingFallbackData(true);
          setFallbackTimestamp(data.cachedAt);
          
          // Remove the fallback indicators for the actual data
          const { isFallbackData, cachedAt, ...actualData } = data;
          setGlobalStats(actualData);
        } else {
          setUsingFallbackData(false);
          setGlobalStats(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response?.data || err.message);
        setError(err.message || 'Failed to fetch global stats');
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []);

  if (loading) return <Spinner />;

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-blue-800">
      <div className="bg-red-500/20 backdrop-blur-lg p-6 rounded-xl text-white">
        <h2 className="text-xl font-bold mb-2">Error loading data</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-lightBlue to-blue-800">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 p-6">
        {usingFallbackData && (
          <div className="bg-yellow-500/20 backdrop-blur-lg p-4 rounded-xl mb-6 text-white flex items-center justify-between">
            <p>
              <span className="font-bold">Note:</span> Showing previously cached data from {formatDate(fallbackTimestamp)}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-yellow-500/30 hover:bg-yellow-500/50 px-4 py-1 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      
        <h2 className="text-3xl font-bold mb-6 text-white">Global Crypto Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Total Cryptocurrencies</h3>
            <p className="text-2xl font-bold text-white">{millify(globalStats.total)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Total Exchanges</h3>
            <p className="text-2xl font-bold text-white">{millify(globalStats.totalExchanges)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Total 24h Volume</h3>
            <p className="text-2xl font-bold text-white">{millify(globalStats.total24hVolume)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Total Markets</h3>
            <p className="text-2xl font-bold text-white">{millify(globalStats.totalMarkets)}</p>
          </div>
        </div>

        <div className="mt-12 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Top 10 Cryptocurrencies</h2>
          <Link to="/cryptocurrencies" className="text-blue-200 hover:text-white font-semibold transition-colors">
            Show More →
          </Link>
        </div>
        <Cryptocurrencies simplified />

        <div className="mt-12 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Latest Crypto News</h2>
          <Link to="/news" className="text-blue-200 hover:text-white font-semibold transition-colors">
            Show More →
          </Link>
        </div>
        <News simplified />
      </div>
    </div>
  );
};

export default Homepage;