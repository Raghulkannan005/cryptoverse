import { useState } from 'react';
import moment from 'moment';
import { FaCalendarAlt } from 'react-icons/fa';

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  
  // Dummy news data - will replace with API data later
  const dummyNews = [
    {
      url: 'https://example.com',
      name: 'Bitcoin Surges to New Heights',
      description: 'Bitcoin reaches new all-time high as institutional adoption increases',
      thumbnail: 'https://via.placeholder.com/150',
      provider: [{ name: 'CryptoNews', image: 'https://via.placeholder.com/30' }],
      datePublished: '2024-02-23T09:00:00.000Z'
    }
  ];

  const categories = ['Cryptocurrency', 'Bitcoin', 'Ethereum'];

  return (
    <div className="p-4">
      {!simplified && (
        <div className="mb-6">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewsCategory(e.target.value)}
            defaultValue={newsCategory}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyNews.map((news, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <a href={news.url} target="_blank" rel="noreferrer" className="block">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold flex-1 mr-4">{news.name}</h4>
                  <img 
                    className="w-20 h-20 object-cover rounded" 
                    src={news.thumbnail} 
                    alt="news" 
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  {news.description.length > 100 
                    ? `${news.description.substring(0, 100)}...` 
                    : news.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <img 
                      className="w-6 h-6 rounded-full" 
                      src={news.provider[0]?.image} 
                      alt={news.provider[0]?.name} 
                    />
                    <span>{news.provider[0]?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>{moment(news.datePublished).startOf('ss').fromNow()}</span>
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