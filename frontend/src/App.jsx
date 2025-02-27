import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Cryptocurrencies from './components/Cryptocurrencies';
import CryptoDetails from './components/CryptoDetails';
import News from './components/News';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Spinner from './components/Spinner';
import WatchlistPage from './components/WatchlistPage';

// Protected route component with context
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <Spinner />;

  return (
    <Routes>
      {/* Redirect root to home or login based on auth status */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
      } />
      
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/home" /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/home" /> : <Register />
      } />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      } />
      <Route path="/cryptocurrencies" element={
        <ProtectedRoute>
          <Cryptocurrencies />
        </ProtectedRoute>
      } />
      <Route path="/crypto/:coinId" element={
        <ProtectedRoute>
          <CryptoDetails />
        </ProtectedRoute>
      } />
      <Route path="/news" element={
        <ProtectedRoute>
          <News />
        </ProtectedRoute>
      } />
      <Route path="/watchlist" element={
        <ProtectedRoute>
          <WatchlistPage />
        </ProtectedRoute>
      } />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <div className="navbar">
            <Navbar />
          </div>
          <div className="main flex flex-col min-h-screen">
            <div className="flex-grow">
              <AppRoutes />
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
                  <Link to="/home" className="hover:text-blue-900 transition-colors">
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
    </AuthProvider>
  );
};

export default App;