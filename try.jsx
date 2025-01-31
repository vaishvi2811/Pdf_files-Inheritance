import React from 'react';
import './App.css';
import Dashboard from './Components/Dashboard';
import SectorsPage from './Components/SectorsPage';
import StockWatchlist from './Components/StockWatchlist';
// import UserProfile from './Components/UserProfile';
import Portfolio from './Components/Portfolio';
import StockCard from './Components/StockCards';
import StockDetail from './Components/StockPage';
import Login from './Components/Login';
import Signup from './Components/Signup';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Default Page is Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/stock-card" element={<StockCard />} />
        <Route path="/stock-watchlist" element={<StockWatchlist />} />
        <Route path="/stock-detail" element={<StockDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
    
  );
}

export default App;


<