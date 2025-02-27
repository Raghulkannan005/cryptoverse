import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Add proper dependency array to avoid infinite loop
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-token`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsAuthenticated(response.data.valid);
      setUser(response.data.user);
      setLoading(false);
      return response.data.valid;
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []); // Empty dependency array since this doesn't depend on other state

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return { error: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return { 
    isAuthenticated, 
    loading, 
    user, 
    login, 
    logout,
    checkAuthStatus
  };
};