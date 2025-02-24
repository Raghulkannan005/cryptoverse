import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { fetchNews } from '../services/newsApi';
import Spinner from './Spinner';

const News = ({ simplified }) => {
  const [filters, setFilters] = useState({
    category: 'cryptocurrency',
    sentiment: null
  });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'cryptocurrency',
    'crypto market',
    'bitcoin',
    'ethereum',
    'blockchain technology',
    'defi'
  ];
  const sentiments = [
    { value: null, label: 'All' },
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
    { value: 'neutral', label: 'Neutral' }
  ];

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNews({
          ...filters,
          count: simplified ? 6 : 10 // Adjust count based on simplified prop
        });
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [filters, simplified]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <Spinner />;

  if (error) return (
    <div className="text-center p-4 bg-red-50 text-red-500 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="p-4">
      {!simplified && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('category', e.target.value)}
            value={filters.category}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            value={filters.sentiment || ''}
          >
            {sentiments.map(({ value, label }) => (
              <option key={label} value={value || ''}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, i) => (
          <div key={i} className="bg-white backdrop-blur-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20">
            <a href={article.link} target="_blank" rel="noreferrer" className="block">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-blue-900 flex-1 mr-4">
                    {article.title}
                  </h4>
                  {article.image_url && (
                    <img 
                      className="w-20 h-20 object-cover rounded" 
                      src={article.image_url}
                      alt="news"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
                <p className="text-blue-900/80 mb-4">
                  {article.description?.length > 100 
                    ? `${article.description.substring(0, 100)}...` 
                    : article.description}
                </p>
                <div className="flex justify-between items-center text-sm text-blue-900/60">
                  <div className="flex items-center space-x-2">
                    <FaNewspaper className="text-blue-400" />
                    <span>{article.source || 'Unknown Source'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="text-blue-400" />
                    <span>{moment(article.pubDate).fromNow()}</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;