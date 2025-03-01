import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import millify from 'millify';
import Spinner from './Spinner';
import axios from 'axios';

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [fallbackTimestamp, setFallbackTimestamp] = useState(null);

  useEffect(() => {
     const fetchCryptos = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cryptos/coins?count=${count}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Check the structure of the response
        console.log("Crypto data received:", data);
        
        // Handle both array and object with data property formats
        let cryptoData;
        if (Array.isArray(data)) {
          cryptoData = data;
          setUsingFallbackData(false);
        } else if (data && data.data) {
          // If the response has a data property, use that
          cryptoData = data.data;
          setUsingFallbackData(!!data.isFallbackData);
          setFallbackTimestamp(data.cachedAt);
        } else {
          // If we can't determine the structure, set an error
          throw new Error('Unexpected data format received');
        }
        
        setCryptos(cryptoData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cryptos:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCryptos();
  }, [count]);

  // Filter cryptos based on search term
  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;
  
  if (error) return (
    <div className="text-red-500 p-4 bg-red-100 rounded-md">
      Error: {error}
    </div>
  );

  return (
    <div className="crypto-container">
      {!simplified && (
        <div className="mb-6">
          {usingFallbackData && (
            <div className="bg-yellow-500/20 backdrop-blur-lg p-4 rounded-xl mb-6 text-blue-900 flex items-center justify-between">
              <p>
                <span className="font-bold">Note:</span> Showing previously cached data from {
                  fallbackTimestamp ? new Date(fallbackTimestamp).toLocaleString() : 'unknown time'
                }
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-yellow-500/30 hover:bg-yellow-500/50 px-4 py-1 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          )}
          
          <input 
            placeholder="Search Cryptocurrency" 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white/10 backdrop-blur-lg text-blue-900 placeholder:text-blue-900/70 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCryptos.map((currency) => (
          <Link to={`/crypto/${currency.symbol}`} key={currency.symbol}>
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-900">
                  {`${currency.name}`}
                </h2>
                <img 
                  className="h-10 w-10 rounded-full bg-blue-900/30 p-1" 
                  src={currency.icon_url || `https://cryptoicons.org/api/icon/${currency.symbol.toLowerCase()}/30`} 
                  alt={currency.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${currency.symbol}&background=random&color=fff&size=30`;
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2 text-sm text-blue-900/90">
                <p>Price: ${currency.price && millify(currency.price)}</p>
                <p>Market Cap: ${currency.marketCap && millify(currency.marketCap)}</p>
                <p>Daily Change: {millify(currency.price || 0)}%</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cryptocurrencies;