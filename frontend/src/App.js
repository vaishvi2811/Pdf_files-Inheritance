import React from 'react';
import './App.css';
import Dashboard from './Components/Dashboard';
import SectorsPage from './Components/SectorsPage';
import StockWatchlist from './Components/StockWatchlist';
import UserProfile from './Components/UserProfile';
import Portfolio from './Components/Portfolio';
import StockCard from './Components/StockCards';
import StockDetail from './Components/StockPage';

function App() {
  return (
    <div className="App">
     <Dashboard />
     <SectorsPage />
     <StockCard />
     <StockWatchlist /> 
     <StockDetail />
     {/* <UserProfile />  */}
      <Portfolio /> 
    </div>
  );
}

export default App;
