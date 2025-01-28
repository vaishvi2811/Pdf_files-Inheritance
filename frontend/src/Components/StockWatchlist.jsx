import React, { useState, useRef, useEffect } from 'react';
import './StockWatchlist.css';

const StockWatchlist = () => {
  const [watchlists, setWatchlists] = useState([{ id: 1, name: 'Watchlist1', stocks: [] }]);
  const [activeWatchlist, setActiveWatchlist] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTemplate, setOrderTemplate] = useState({ stock: '', type: 'buy', quantity: 0 });
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [editingWatchlist, setEditingWatchlist] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const editInputRef = useRef(null);

  const allStocks = ['reliance', 'sadhya motors', 'tata motors', 'Amazun', 'raju motors', 'Tesla'];

  useEffect(() => {
    if (editingWatchlist && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingWatchlist]);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const addWatchlist = () => {
    const newId = watchlists.length + 1;
    setWatchlists([...watchlists, { id: newId, name: `Watchlist${newId}`, stocks: [] }]);
  };

  const renameWatchlist = (id, newName) => {
    if (newName.trim()) {
      setWatchlists(watchlists.map(list => 
        list.id === id ? { ...list, name: newName.trim() } : list
      ));
      showNotification('Watchlist renamed successfully');
    }
    setEditingWatchlist(null);
  };

  const deleteWatchlist = (id) => {
    if (watchlists.length === 1) {
      showNotification('Cannot delete the last watchlist');
      return;
    }
    
    setWatchlists(watchlists.filter(list => list.id !== id));
    if (activeWatchlist === id) {
      setActiveWatchlist(watchlists.find(list => list.id !== id)?.id);
    }
    showNotification('Watchlist deleted successfully');
    setShowDeleteConfirm(null);
  };

  const handleKeyDown = (e, id, currentName) => {
    if (e.key === 'Enter') {
      renameWatchlist(id, e.target.value);
    } else if (e.key === 'Escape') {
      setEditingWatchlist(null);
    }
  };


  const addStockToWatchlist = (stock) => {
    const currentWatchlist = watchlists.find(list => list.id === activeWatchlist);
    if (currentWatchlist.stocks.includes(stock)) {
      return;
    }

    setWatchlists(watchlists.map(list => {
      if (list.id === activeWatchlist) {
        return { ...list, stocks: [...list.stocks, stock] };
      }
      return list;
    }));
    showNotification(`${stock} added to watchlist`);
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
    showNotification('Order placed successfully!');
    setOrderTemplate({ stock: '', type: 'buy', quantity: 0 });
  };

  const filteredStocks = allStocks.filter(stock => 
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
    {notification.show && (
      <div className="notification">
        <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{notification.message}</span>
      </div>
    )}

    <div className="watchlist-wrapper">
      <div className="tabs-container">
        <div className="tabs-list">
          {watchlists.map(list => (
            <div key={list.id} className="tab-container">
              {editingWatchlist === list.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  className="rename-input"
                  defaultValue={list.name}
                  onBlur={(e) => renameWatchlist(list.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, list.id, list.name)}
                />
              ) : (
                <>
                  <button
                    onClick={() => setActiveWatchlist(list.id)}
                    className={`tab-button ${activeWatchlist === list.id ? 'active' : ''}`}
                  >
                    {list.name}
                  </button>
                  <div className="tab-actions">
                    <button 
                      className="tab-action-button"
                      onClick={() => setEditingWatchlist(list.id)}
                    >
                      ✎
                    </button>
                    <button 
                      className="tab-action-button delete"
                      onClick={() => setShowDeleteConfirm(list.id)}
                    >
                      ×
                    </button>
                  </div>
                  {showDeleteConfirm === list.id && (
                    <div className="delete-confirm">
                      <p>Delete this watchlist?</p>
                      <div className="delete-actions">
                        <button onClick={() => deleteWatchlist(list.id)}>Yes</button>
                        <button onClick={() => setShowDeleteConfirm(null)}>No</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <button onClick={addWatchlist} className="tab-button">+</button>
        </div>
      </div>

        <div className="content-container">
          <div className="stocks-panel">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="stocks-list">
              {(searchTerm ? filteredStocks : watchlists.find(l => l.id === activeWatchlist)?.stocks).map(stock => (
                <div key={stock} className="stock-item">
                  <span>{stock}</span>
                  <button 
                    onClick={() => searchTerm ? addStockToWatchlist(stock) : removeStockFromWatchlist(stock)}
                    className={searchTerm ? 'add-button' : 'remove-button'}
                  >
                    {searchTerm ? 'Add' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="order-panel">
            <h3 className="order-title">Place Order</h3>
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