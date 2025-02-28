import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { FaDollarSign, FaHashtag, FaCheck, FaExclamationCircle, FaMoneyBillWave } from 'react-icons/fa';
import { fetchCoinDetails, fetchCoinHistory } from '../services/cryptoApi';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [timeperiod, setTimeperiod] = useState('7d');
  const [coinHistory, setCoinHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const time = ['24h', '7d', '30d', '3m', '1y'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const detailsData = await fetchCoinDetails(coinId);
        const historyData = await fetchCoinHistory(coinId, timeperiod);
        
        setCryptoDetails(detailsData);
        setCoinHistory(historyData);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, timeperiod]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!cryptoDetails || !coinHistory) return (
    <div className="flex justify-center items-center h-screen text-red-500 text-xl">
      No data available
    </div>
  );

  // Chart data
  const coinPrice = coinHistory.history.map((point) => point.price);
  const coinTimestamp = coinHistory.history.map((point) => {
    const date = new Date(point.timestamp);
    return timeperiod === '24h' 
      ? date.toLocaleTimeString() 
      : date.toLocaleDateString();
  });
  
  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: 'Price in USD',
        data: coinPrice,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        ticks: {
          beginAtZero: false,
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    }
  };

  // Your existing stats arrays...
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
              src={cryptoDetails.icon_url} 
              alt={cryptoDetails.name}
              className="w-12 h-12 mr-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48?text=?';
              }}
            />
            {cryptoDetails.name} ({cryptoDetails.symbol})
          </h2>
        </div>
        <p className="text-gray-300 text-lg">
          {cryptoDetails.name} live price in US dollars.
          View value statistics, market cap and supply.
        </p>
      </div>

      {/* Price History Chart */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl mb-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {cryptoDetails.name} Price Chart
          </h3>
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-white mr-4">
              <span className={coinHistory.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {coinHistory.change}%
              </span>
            </p>
            <div className="flex space-x-2">
              {time.map((period) => (
                <button 
                  key={period}
                  onClick={() => setTimeperiod(period)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeperiod === period 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
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