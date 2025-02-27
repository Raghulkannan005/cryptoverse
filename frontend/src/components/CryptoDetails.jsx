import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { FaDollarSign, FaHashtag, FaCheck, FaExclamationCircle, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { fetchCoinDetails } from '../services/cryptoApi';
import axios from 'axios';

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await fetchCoinDetails(coinId);
      setCryptoDetails(data);
      setLoading(false);
    };

    fetchDetails();
  }, [coinId]);

  const checkWatchlistStatus = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cryptos/watchlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Check if current coin is in watchlist
      const isInList = data.coins.some(coin => coin.symbol === coinId);
      setIsInWatchlist(isInList);
    } catch (err) {
      console.error('Error checking watchlist status:', err);
    }
  };

  useEffect(() => {
    checkWatchlistStatus();
  }, [coinId]);

  const toggleWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/cryptos/watchlist`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: { coinId }
        });
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cryptos/watchlist`, 
          { coinId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!cryptoDetails) return (
    <div className="flex justify-center items-center h-screen text-red-500 text-xl">
      No data available
    </div>
  );

  const stats = [
    { 
      title: 'Price to USD', 
      value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`, 
      icon: <FaDollarSign className="text-green-500" /> 
    },
    { 
      title: 'Rank', 
      value: cryptoDetails.rank, 
      icon: <FaHashtag className="text-blue-500" /> 
    },
    { 
      title: 'Market Cap', 
      value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, 
      icon: <FaDollarSign className="text-green-500" /> 
    },
  ];

  const genericStats = [
    { 
      title: 'Number Of Markets', 
      value: cryptoDetails.numberOfMarkets, 
      icon: <FaMoneyBillWave className="text-yellow-500" /> 
    },
    { 
      title: 'Number Of Exchanges', 
      value: cryptoDetails.numberOfExchanges, 
      icon: <FaMoneyBillWave className="text-yellow-500" /> 
    },
    { 
      title: 'Approved Supply', 
      value: cryptoDetails.supply?.confirmed ? 
        <FaCheck className="text-green-500" /> : 
        <FaExclamationCircle className="text-red-500" />, 
      icon: <FaExclamationCircle className="text-blue-500" /> 
    },
    { 
      title: 'Total Supply', 
      value: `$ ${cryptoDetails.supply?.total && millify(cryptoDetails.supply?.total)}`, 
      icon: <FaExclamationCircle className="text-blue-500" /> 
    },
    { 
      title: 'Circulating Supply', 
      value: `$ ${cryptoDetails.supply?.circulating && millify(cryptoDetails.supply?.circulating)}`, 
      icon: <FaExclamationCircle className="text-blue-500" /> 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="flex justify-between items-start">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center">
            <img 
              src={cryptoDetails.iconUrl} 
              alt={cryptoDetails.name}
              className="w-12 h-12 mr-4"
            />
            {cryptoDetails.name} ({cryptoDetails.symbol})
          </h2>
          
          <button
            onClick={toggleWatchlist}
            disabled={watchlistLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              isInWatchlist 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <FaStar className={isInWatchlist ? 'text-white' : 'text-yellow-400'} />
            <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
        <p className="text-gray-300 text-lg">
          {cryptoDetails.name} live price in US dollars.
          View value statistics, market cap and supply.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Value Statistics */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {cryptoDetails.name} Value Statistics
            </h3>
            <p className="text-gray-400">
              An overview showing the stats of {cryptoDetails.name}
            </p>
          </div>
          <div className="space-y-4">
            {stats.map(({ icon, title, value }) => (
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200" key={title}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-gray-300">{title}</span>
                </div>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Statistics */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Other Statistics
            </h3>
            <p className="text-gray-400">
              An overview showing the stats of all cryptocurrencies
            </p>
          </div>
          <div className="space-y-4">
            {genericStats.map(({ icon, title, value }) => (
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200" key={title}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-gray-300">{title}</span>
                </div>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;