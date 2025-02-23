import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { FaDollarSign, FaHashtag, FaBolt, FaTrophy, FaCheck, FaExclamationCircle, FaMoneyBillWave } from 'react-icons/fa';
import { fetchCoinDetails } from '../services/cryptoApi';

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await fetchCoinDetails(coinId);
      setCryptoDetails(data);
      setLoading(false);
    };

    fetchDetails();
  }, [coinId]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (!cryptoDetails) return <div>No data available</div>;

  const stats = [
    { 
      title: 'Price to USD', 
      value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`, 
      icon: <FaDollarSign /> 
    },
    { 
      title: 'Rank', 
      value: cryptoDetails.rank, 
      icon: <FaHashtag /> 
    },
    { 
      title: '24h Volume', 
      value: `$ ${cryptoDetails.volume && millify(cryptoDetails.volume)}`, 
      icon: <FaBolt /> 
    },
    { 
      title: 'Market Cap', 
      value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, 
      icon: <FaDollarSign /> 
    },
    { 
      title: 'All-time-high', 
      value: `$ ${cryptoDetails.allTimeHigh?.price && millify(cryptoDetails.allTimeHigh?.price)}`, 
      icon: <FaTrophy /> 
    },
  ];

  const genericStats = [
    { 
      title: 'Number Of Markets', 
      value: cryptoDetails.numberOfMarkets, 
      icon: <FaMoneyBillWave /> 
    },
    { 
      title: 'Number Of Exchanges', 
      value: cryptoDetails.numberOfExchanges, 
      icon: <FaMoneyBillWave /> 
    },
    { 
      title: 'Approved Supply', 
      value: cryptoDetails.supply?.confirmed ? <FaCheck /> : <FaExclamationCircle />, 
      icon: <FaExclamationCircle /> 
    },
    { 
      title: 'Total Supply', 
      value: `$ ${cryptoDetails.supply?.total && millify(cryptoDetails.supply?.total)}`, 
      icon: <FaExclamationCircle /> 
    },
    { 
      title: 'Circulating Supply', 
      value: `$ ${cryptoDetails.supply?.circulating && millify(cryptoDetails.supply?.circulating)}`, 
      icon: <FaExclamationCircle /> 
    },
  ];

  return (
    <div className="coin-detail-container p-4">
      <div className="coin-heading-container mb-4">
        <h2 className="coin-name text-2xl font-bold">
          {cryptoDetails.name} ({cryptoDetails.symbol}) Price
        </h2>
        <p>
          {cryptoDetails.name} live price in US dollars.
          View value statistics, market cap and supply.
        </p>
      </div>

      <div className="stats-container grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="coin-value-statistics bg-gray-800 p-4 rounded-lg">
          <div className="coin-value-statistics-heading mb-4">
            <h3 className="coin-details-heading text-xl font-bold">
              {cryptoDetails.name} Value Statistics
            </h3>
            <p>An overview showing the stats of {cryptoDetails.name}</p>
          </div>
          {stats.map(({ icon, title, value }) => (
            <div className="coin-stats flex justify-between items-center mb-2" key={title}>
              <div className="coin-stats-name flex items-center space-x-2">
                <span>{icon}</span>
                <span>{title}</span>
              </div>
              <span className="stats">{value}</span>
            </div>
          ))}
        </div>

        <div className="other-stats-info bg-gray-800 p-4 rounded-lg">
          <div className="coin-value-statistics-heading mb-4">
            <h3 className="coin-details-heading text-xl font-bold">
              Other Statistics
            </h3>
            <p>An overview showing the stats of all cryptocurrencies</p>
          </div>
          {genericStats.map(({ icon, title, value }) => (
            <div className="coin-stats flex justify-between items-center mb-2" key={title}>
              <div className="coin-stats-name flex items-center space-x-2">
                <span>{icon}</span>
                <span>{title}</span>
              </div>
              <span className="stats">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;