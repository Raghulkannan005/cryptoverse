import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import icon from '../images/cryptocurrency.png';

// Memoize the Navbar to prevent unnecessary re-renders
const Navbar = memo(() => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);
  const { isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    // Import and call clearApiCache if needed
    // clearApiCache();
    navigate('/login');
  };

  return (
    <div className="nav-container bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={icon} alt="Cryptoverse Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-lightBlue text-xl font-bold">
              <Link to={isAuthenticated ? "/home" : "/login"}>Cryptoverse</Link>
            </h2>
          </div>
          
          <nav className="hidden md:flex items-center">
            {isAuthenticated && (
              <ul className="flex space-x-8">
                <li>
                  <Link to="/home" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">
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
            )}
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="ml-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="ml-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
Navbar.displayName = 'Navbar';

export default Navbar;