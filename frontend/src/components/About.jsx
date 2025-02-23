import { FaGlobe, FaShieldAlt, FaUsers, FaLightbulb } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaGlobe className="text-4xl text-blue-500" />,
      title: 'Global Coverage',
      description: 'Track cryptocurrencies from around the world with real-time data and comprehensive market analysis.'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
      title: 'Reliable Information',
      description: 'Access trusted and verified cryptocurrency data from industry-leading sources and APIs.'
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: 'Community Driven',
      description: 'Join a growing community of crypto enthusiasts and stay informed with the latest market trends.'
    },
    {
      icon: <FaLightbulb className="text-4xl text-blue-500" />,
      title: 'Market Insights',
      description: 'Get detailed insights and analytics to make informed decisions about your cryptocurrency investments.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        About Cryptoverse
      </h1>

      <div className="mb-12">
        <p className="text-lg text-center text-gray-700">
          Cryptoverse is your premier destination for cryptocurrency information and market data. 
          We provide real-time cryptocurrency prices, market cap rankings, and the latest crypto news 
          to help you stay informed in the dynamic world of digital assets.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">
        Our Features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-center my-10">
        Our Mission
      </h2>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-lg text-center text-gray-700">
          Our mission is to provide transparent, accurate, and timely cryptocurrency 
          information to empower investors and enthusiasts in making informed decisions. 
          We strive to make crypto markets more accessible and understandable for everyone, 
          from beginners to experienced traders.
        </p>
      </div>
    </div>
  );
};

export default About;