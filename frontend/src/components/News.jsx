import { useState, useEffect } from 'react';
import moment from 'moment';
import Spinner from './Spinner';
import axios from 'axios';

const News = ({ simplified }) => {
  const count = simplified ? 6 : 12;
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [fallbackTimestamp, setFallbackTimestamp] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cryptos/news?count=${count}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Log the data structure
        console.log("News data received:", data);
        
        // Handle both array and object with data property formats
        let newsData;
        if (Array.isArray(data)) {
          newsData = data;
          setUsingFallbackData(false);
        } else if (data && data.data) {
          // If the response has a data property, use that
          newsData = data.data;
          setUsingFallbackData(!!data.isFallbackData);
          setFallbackTimestamp(data.cachedAt);
        } else {
          // If we can't determine the structure, set an error
          throw new Error('Unexpected data format received');
        }
        
        setCryptoNews(newsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [count]);

  if (loading) return <Spinner />;
  
  if (error) return (
    <div className="text-red-500 p-4 bg-red-100 rounded-md">
      Error: {error}
    </div>
  );

  return (
    <div className="news-container">
      {!simplified && usingFallbackData && (
        <div className="bg-yellow-500/20 backdrop-blur-lg p-4 rounded-xl mb-6 text-white flex items-center justify-between">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptoNews.map((news, i) => (
          <a 
            href={news.link} 
            target="_blank" 
            rel="noreferrer"
            key={i}
            className="bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/15 transition-all h-full flex flex-col"
          >
            <div className="flex justify-between mb-4 flex-grow">
              <div className="w-3/4 pr-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-3">{news.title}</h3>
                <p className="text-white/70 text-sm line-clamp-3">
                  {news.description.length > 100 
                    ? `${news.description.substring(0, 100)}...` 
                    : news.description}
                </p>
              </div>
              <div className="w-1/4">
                <img 
                  src={news.image_url || 'https://via.placeholder.com/100?text=News'} 
                  alt={news.title}
                  className="w-full h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=News';
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/10 text-xs text-white/60">
              <p>Source: {news.source}</p>
              <p>{moment(news.pubDate || new Date()).fromNow()}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default News;