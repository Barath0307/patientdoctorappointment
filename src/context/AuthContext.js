// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// AuthProvider component to provide auth state
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check sessionStorage for token on load
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setAuthToken = (token) => {
    setToken(token);
    sessionStorage.setItem('authToken', token);
  };

  const clearAuthToken = () => {
    setToken(null);
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, setAuthToken, clearAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the Auth context
export const useAuth = () => useContext(AuthContext);
