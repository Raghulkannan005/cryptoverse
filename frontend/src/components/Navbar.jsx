import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import icon from '../images/cryptocurrency.png';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 768) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="nav-container bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={icon} alt="Cryptoverse Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-lightBlue text-xl font-bold">
              <Link to="/">Cryptoverse</Link>
            </h2>
          </div>
          
          {activeMenu && (
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/cryptocurrencies" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
                    Cryptocurrencies
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;