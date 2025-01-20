import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ userName }) => {
  const [thought, setThought] = useState('Be patient and think long-term');
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [isInvestmentVisible, setIsInvestmentVisible] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [newWatchItem, setNewWatchItem] = useState('');

  useEffect(() => {
    const fetchThought = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
        });
        const data = await response.json();
        setThought(data[0]?.quote || 'Stay positive and invest wisely.');
      } catch (error) {
        console.error('Failed to fetch thought:', error);
      }
    };

    fetchThought();
    const interval = setInterval(fetchThought, 10000);

    return () => clearInterval(interval);
  }, []);

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
  const GlobalIndices = () => {
    const indices = [
      { name: "Dow Jones", value: "34,000", change: "+1.2%" },
      { name: "NASDAQ", value: "14,500", change: "-0.8%" },
      { name: "S&P 500", value: "4,200", change: "+0.5%" },
      { name: "FTSE 100", value: "7,200", change: "-0.3%" },
    ];
  }
  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">SCAM 1997</div>
        <nav className="nav">
          <input type="text" placeholder="Search bar" />
        </nav>
        <div className="profile">Profile</div>
      </header>

      <main className="main-content">
        <div className="box">
          <div className="welcome-section">
            <h2>Hi, {userName}</h2>
            <div className="thought">{thought}</div>
          </div>
        </div>

        <div className="investment-section">
          <div className="box2">
            <div className="box3">
              <div className="investment-box">
                <h4>Your Investments</h4>
                <button onClick={() => setIsInvestmentVisible(!isInvestmentVisible)}>
                  {isInvestmentVisible ? 'Hide Investment' : 'Show Investment'}
                </button>

                {isInvestmentVisible && (
                  <>
                    {investmentAmount === 0 ? (
                      <p>No investments yet.</p>
                    ) : (
                      <p>Amount Invested: ${investmentAmount}</p>
                    )}
                    <input
                      type="number"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="Enter investment amount"
                    />
                    <button onClick={handleInvestment}>Invest</button>
                  </>
                )}
              </div>
            </div>
            <div className="box3">
              <div className="investment-box">
                <h4>Watchlist</h4>
                <ul>
                  {watchlist.length === 0 ? (
                    <li>No items in your watchlist.</li>
                  ) : (
                    watchlist.map((item, index) => <li key={index}>{item}</li>)
                  )}
                </ul>
                <input
                  type="text"
                  value={newWatchItem}
                  onChange={(e) => setNewWatchItem(e.target.value)}
                  placeholder="Add to watchlist"
                />
                <button onClick={handleAddToWatchlist}>Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* New Indian Indices Box */}
        <div className="indices-section">
          <div className="index-box">
            <h4>Indian Indices</h4>
            <p>Sensex, Nifty 50, and more...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
