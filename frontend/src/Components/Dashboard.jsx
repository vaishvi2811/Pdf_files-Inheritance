import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { TrendingUp, Eye, User, Search, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ userName }) => {
  const navigate = useNavigate();
  const [thought, setThought] = useState('Be patient and think long-term');
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [isInvestmentVisible, setIsInvestmentVisible] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [newWatchItem, setNewWatchItem] = useState('');
  const [indices, setIndices] = useState([]);


  useEffect(() => {
    const fetchMarketIndices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/market-indices'); // Call your backend API
        const data = await response.json();
        
        if (data.success) {
          setIndices(data.data);
        } else {
          console.error('Failed to fetch market indices');
        }
      } catch (error) {
        console.error('Error fetching market indices:', error);
      }
    };

    fetchMarketIndices();

    // Set interval to fetch data every 1 minute (optional for real-time updates)
    const interval = setInterval(fetchMarketIndices, 60000);
    return () => clearInterval(interval);
  }, []);

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
        {indices.length > 0 ? (
          indices.map((index, i) => (
            <div key={i} className="index-item">
              <h4>{index.name}</h4>
              <p className="index-value">{index.value}</p>
              <span className={`change ${index.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {index.change}
              </span>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
      </div>

      <div className="summary-stats">
        {[
          { label: 'Sector', value: 'Healthcare' },
          { label: 'Sector', value: 'Automobile' },
          { label: 'Sector', value: 'I. T.' },
          { label: 'Sector', value: 'Energy' }
            ].map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="flex items-center gap-2 mb-2">
                  <span className="icon">{stat.icon}</span>
                  <span className="subtitle text-sm">{stat.label}</span>
                </div>
                <p className="title text-lg">{stat.value}</p>
              </div>
          ))}
        </div>
    </div>
  );
};

export default Dashboard;