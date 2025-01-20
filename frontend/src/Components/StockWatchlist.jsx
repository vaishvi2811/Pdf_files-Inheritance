import React, { useState } from 'react';
import './StockWatchlist.css';

const StockWatchlist = () => {
  const [watchlists, setWatchlists] = useState([{ id: 1, name: 'Watchlist1', stocks: [] }]);
  const [activeWatchlist, setActiveWatchlist] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTemplate, setOrderTemplate] = useState({ stock: '', type: 'buy', quantity: 0 });
  const [showNotification, setShowNotification] = useState(false);

  
  const allStocks = ['reliance', 'sadhya motors', 'tata motors', 'Amazun', 'raju motors', 'Tesla'];

  const addWatchlist = () => {
    const newId = watchlists.length + 1;
    setWatchlists([...watchlists, { id: newId, name: `Watchlist${newId}`, stocks: [] }]);
  };

  const addStockToWatchlist = (stock) => {
    setWatchlists(watchlists.map(list => {
      if (list.id === activeWatchlist && !list.stocks.includes(stock)) {
        return { ...list, stocks: [...list.stocks, stock] };
      }
      return list;
    }));
  };

  const removeStockFromWatchlist = (stock) => {
    setWatchlists(watchlists.map(list => {
      if (list.id === activeWatchlist) {
        return { ...list, stocks: list.stocks.filter(s => s !== stock) };
      }
      return list;
    }));
  };

  const handleOrder = (e) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    setOrderTemplate({ stock: '', type: 'buy', quantity: 0 });
  };

  const filteredStocks = allStocks.filter(stock => 
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {showNotification && (
        <div className="notification">
          <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Order placed successfully!</span>
        </div>
      )}

      <div className="watchlist-wrapper">
        <div className="tabs-container">
          <div className="tabs-list">
            {watchlists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveWatchlist(list.id)}
                className={`tab-button ${activeWatchlist === list.id ? 'active' : ''}`}
              >
                {list.name}
              </button>
            ))}
            <button onClick={addWatchlist} className="tab-button">+</button>
          </div>
        </div>

        <div className="content-container">
          <div className="stocks-panel">
            <input
              type="text"
              placeholder="Search and Add"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="stocks-list">
              {searchTerm ? (
                filteredStocks.map(stock => (
                  <div key={stock} className="stock-item">
                    <span>{stock}</span>
                    <button 
                      onClick={() => addStockToWatchlist(stock)}
                      className="add-button"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                watchlists.find(l => l.id === activeWatchlist)?.stocks.map(stock => (
                  <div key={stock} className="stock-item">
                    <span>{stock}</span>
                    <button 
                      onClick={() => removeStockFromWatchlist(stock)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="order-panel">
            <h3 className="order-title">Buy/sell Order</h3>
            <form onSubmit={handleOrder} className="order-form">
              <select
                value={orderTemplate.stock}
                onChange={(e) => setOrderTemplate({...orderTemplate, stock: e.target.value})}
                className="order-select"
                required
              >
                <option value="">Select Stock</option>
                {watchlists.find(l => l.id === activeWatchlist)?.stocks.map(stock => (
                  <option key={stock} value={stock}>{stock}</option>
                ))}
              </select>

              <select
                value={orderTemplate.type}
                onChange={(e) => setOrderTemplate({...orderTemplate, type: e.target.value})}
                className="order-select"
                required
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={orderTemplate.quantity || ''}
                onChange={(e) => setOrderTemplate({...orderTemplate, quantity: parseInt(e.target.value) || 0})}
                className="order-input"
                required
                min="1"
              />

              <button type="submit" className="order-button">
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockWatchlist;