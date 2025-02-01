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
import { useNavigate } from 'react-router-dom';

function App() {
  // ✅ Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ✅ Check for token on app load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
        <Router>
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated ? <Dashboard/> : <Login setIsAuthenticated={setIsAuthenticated} />
          }
          />
        <Route path="/signup" element={<Signup />} />

        <Route path="/sectors" element={<SectorsPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/stock-card" element={<StockCard setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/stock-watchlist" element={<StockWatchlist setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/stock-detail" element={<StockDetail setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/portfolio" element={<Portfolio setIsAuthenticated={setIsAuthenticated}  />} />
        <Route path="*" element={<Navigate to="/" />} /> // ✅ Redirect all unknown paths to login
    
      </Routes>
        </Router>
  );
}

export default App;
