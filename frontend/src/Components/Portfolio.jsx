import React from 'react';
import './Portfolio.css';

const Portfolio = () => {
  return (
    <div className="portfolio">
      <nav className="navbar">
        <h1>Stock Portfolio</h1>
      </nav>

      <div className="market-indices">
        <div className="market-card">
          <h2>NIFTY 50</h2>
          <p className="price">22,124.65</p>
          <p className="change positive">+145.85 (0.66%)</p>
        </div>
        <div className="market-card">
          <h2>SENSEX</h2>
          <p className="price">72,749.96</p>
          <p className="change positive">+482.70 (0.67%)</p>
        </div>
      </div>

      <div className="portfolio-stats">
        <div className="stat-card">
          <h2>Portfolio Value</h2>
          <p className="value">₹12,50,000</p>
          <p className="label">Total Investment</p>
        </div>
        <div className="stat-card">
          <h2>Today's P&L</h2>
          <p className="value positive">+₹12,500</p>
          <p className="change positive">+1.01%</p>
        </div>
      </div>

      <div className="holdings">
        <h2>Your Holdings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Avg. Price</th>
                <th>LTP</th>
                <th>Current Value</th>
                <th>Day's Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RELIANCE</td>
                <td>100</td>
                <td>₹2,450.00</td>
                <td>₹2,520.50</td>
                <td>₹2,52,050</td>
                <td className="positive">+1.5%</td>
              </tr>
              <tr>
                <td>TCS</td>
                <td>50</td>
                <td>₹3,750.00</td>
                <td>₹3,800.25</td>
                <td>₹1,90,012</td>
                <td className="positive">+0.8%</td>
              </tr>
              <tr>
                <td>HDFC BANK</td>
                <td>75</td>
                <td>₹1,620.00</td>
                <td>₹1,595.30</td>
                <td>₹1,19,647</td>
                <td className="negative">-1.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;