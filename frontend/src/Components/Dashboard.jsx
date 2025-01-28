import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { TrendingUp, Eye, User, Search, Sun } from 'lucide-react';

const Dashboard = ({ userName }) => {
  const [thought, setThought] = useState('Be patient and think long-term');
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [isInvestmentVisible, setIsInvestmentVisible] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [newWatchItem, setNewWatchItem] = useState('');

  const indices = [
    { name: "Sensex", value: "72,500", change: "+1.2%" },
    { name: "Nifty 50", value: "21,800", change: "-0.8%" },
    { name: "Bank Nifty", value: "45,200", change: "+0.5%" },
    { name: "Nifty IT", value: "37,200", change: "-0.3%" },
  ];

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`/api/watchlist?user=${userName}`);
        const data = await response.json();
        setWatchlist(data?.watchlist || []);
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [userName]);

  const handleAddToWatchlist = () => {
    if (newWatchItem.trim()) {
      setWatchlist((prevWatchlist) => [...prevWatchlist, newWatchItem.trim()]);
      setNewWatchItem('');
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <TrendingUp className="logo-icon" size={24} />
          <span>Market Mind</span>
        </div>
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search stocks, mutual funds..." />
        </div>
        <div className="profile-section">
          <Sun className="theme-icon" size={20} />
          <User className="user-icon" size={20} />
        </div>
      </header>

      <section className="welcome-section">
        <h2>Welcome back</h2>
        <div className="thought-bubble">{thought}</div>
      </section>

      <div className="dashboard-grid">
        <section className="investment-card">
          <h3>Your Investments</h3>
          <button 
            className="visibility-toggle"
            onClick={() => setIsInvestmentVisible(!isInvestmentVisible)}
          >
            <Eye size={18} />
            Show Balance
          </button>
        </section>

        <section className="watchlist-card">
          <h3>Watchlist</h3>
          <p>Add stocks to track them</p>
          <div className="watchlist-content">
            <div className="watchlist-input">
              <input
                type="text"
                value={newWatchItem}
                onChange={(e) => setNewWatchItem(e.target.value)}
                placeholder="Add stock symbol"
              />
              <button onClick={handleAddToWatchlist}>Add</button>
            </div>
          </div>
        </section>

        <section className="indices-card">
          <h3>Market Indices</h3>
          <div className="indices-grid">
            {indices.map((index, i) => (
              <div key={i} className="index-item">
                <h4>{index.name}</h4>
                <p className="index-value">{index.value}</p>
                <span className={`change ${index.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {index.change}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;