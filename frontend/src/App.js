import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import SectorsPage from './Components/SectorsPage';
import StockCard from './Components/StockCards';
import StockWatchlist from './Components/StockWatchlist';
import StockDetail from './Components/StockPage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Portfolio from './Components/Portfolio';
import { getAuthToken } from './utils/auth';

function App() {
  // ✅ Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check for token on app load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/stock-card" element={<StockCard />} />
            <Route path="/stock-watchlist" element={<StockWatchlist />} />
            <Route path="/stock-detail" element={<StockDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} /> // ✅ Redirect all unknown paths to login
        )}
      </Routes>
  );
}

export default App;
