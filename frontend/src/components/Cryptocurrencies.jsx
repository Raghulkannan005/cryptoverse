import { useState, useEffect } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { fetchCoins } from '../services/cryptoApi';

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchCoins(count);
        setCryptos(Object.values(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [count]);

  const filteredData = cryptos.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="text-center p-4 bg-red-50 text-red-500 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="p-4">
      {!simplified && (
        <div className="mb-6 relative">
          <input 
            type="text"
            placeholder="Search Cryptocurrency" 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.map((currency) => (
          <Link 
            to={`/crypto/${currency.symbol}`}
            key={currency.symbol}
            className="block"
          >
            <div className="bg-white backdrop-blur-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20">
              <div className="p-4 border-b border-white/20 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">{currency.name}</h3>
                <img 
                  className="w-8 h-8" 
                  src={currency.icon_url} 
                  alt={currency.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/32?text=?';
                  }}
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-blue-900">
                  Symbol: <span className="font-medium">{currency.symbol}</span>
                </p>
                <p className="text-blue-900">
                  Max Supply: <span className="font-medium">
                    {currency.max_supply === "N/A" ? "Unlimited" : millify(currency.max_supply)}
                  </span>
                </p>
                <p className="text-blue-900">
                  Full Name: <span className="font-medium">{currency.name_full}</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cryptocurrencies;