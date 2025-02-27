import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import millify from 'millify';
import { FaTrash, FaStar, FaSpinner } from 'react-icons/fa';

const Watchlist = ({ simplified }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cryptos/watchlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWatchlist(data.coins);
      setError('');
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to load your watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (coinId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/cryptos/watchlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: { coinId }
      });
      
      // Update local state to reflect the change
      setWatchlist(prev => prev.filter(coin => coin.symbol !== coinId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove coin. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-white p-4 rounded-xl">
        <p>{error}</p>
        <button 
          onClick={fetchWatchlist} 
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl text-center text-white">
        <FaStar className="text-4xl mx-auto mb-3 text-yellow-400" />
        <h3 className="text-xl font-bold mb-2">Your watchlist is empty</h3>
        <p className="mb-4">Start adding cryptocurrencies to keep track of them</p>
        <Link to="/cryptocurrencies" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block">
          Browse Cryptocurrencies
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Your Watchlist</h3>
        {!simplified && (
          <Link to="/watchlist" className="text-blue-200 hover:text-white transition-colors">
            Manage Watchlist
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {watchlist.slice(0, simplified ? 4 : watchlist.length).map(coin => (
          <div key={coin.symbol} className="bg-white/10 backdrop-blur-lg p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={coin.icon_url || 'https://via.placeholder.com/32?text=?'} 
                alt={coin.name} 
                className="w-8 h-8 mr-3"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32?text=?';
                }}
              />
              <div>
                <Link to={`/crypto/${coin.symbol}`} className="text-white hover:text-blue-300 font-medium">
                  {coin.name}
                </Link>
                <p className="text-white/70 text-sm">{coin.symbol}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium">
                ${coin.price ? millify(coin.price) : 'N/A'}
              </span>
              
              {!simplified && (
                <button 
                  onClick={() => handleRemoveFromWatchlist(coin.symbol)}
                  className="text-red-400 hover:text-red-500 p-1"
                  title="Remove from watchlist"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {simplified && watchlist.length > 4 && (
        <div className="text-center mt-4">
          <Link to="/watchlist" className="text-blue-300 hover:text-white font-medium inline-block mt-2">
            View All ({watchlist.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default Watchlist;