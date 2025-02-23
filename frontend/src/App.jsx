import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Cryptocurrencies from './components/Cryptocurrencies';
import CryptoDetails from './components/CryptoDetails';
import News from './components/News';
import Contact from './components/Contact';
import About from './components/About';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="main flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route exact path="/" element={<Homepage />} />
              <Route exact path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route exact path="/crypto/:coinId" element={<CryptoDetails />} />
              <Route exact path="/news" element={<News />} />
              <Route exact path="/contact" element={<Contact />} />
              <Route exact path="/about" element={<About />} />
            </Routes>
          </div>
          <footer className="bg-white text-blue-900 py-6">
            <div className="container mx-auto px-4">
              <div className="text-center mb-4">
                <h5 className="text-lg font-bold">
                  Cryptoverse <br />
                  All rights reserved
                </h5>
              </div>
              <div className="flex justify-center space-x-4">
                <Link to="/" className="hover:text-blue-900 transition-colors">
                  Home
                </Link>
                <Link to="/news" className="hover:text-blue-900 transition-colors">
                  News
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;