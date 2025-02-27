import { useState } from 'react';
import Watchlist from './Watchlist';
import { FaStar } from 'react-icons/fa';

const WatchlistPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-blue-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <FaStar className="text-yellow-400 mr-2" /> Your Watchlist
          </h2>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl shadow-xl">
          <Watchlist key={refreshKey} simplified={false} />
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;