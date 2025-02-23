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

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      const data = await fetchCoins(count);
      setCryptos(data);
      setLoading(false);
    };

    fetchCryptoData();
  }, [count]);

  const filteredData = cryptos.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
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
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{currency.name}</h3>
                <img 
                  className="w-8 h-8" 
                  src={currency.iconUrl} 
                  alt={currency.name}
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-gray-700">
                  Price: <span className="font-medium">$ {millify(currency.price)}</span>
                </p>
                <p className="text-gray-700">
                  Market Cap: <span className="font-medium">$ {millify(currency.marketCap)}</span>
                </p>
                <p className="text-gray-700">
                  Daily Change: <span className={`font-medium ${
                    currency.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>{millify(currency.change)}%</span>
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