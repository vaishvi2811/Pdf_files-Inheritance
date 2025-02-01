// import React from 'react';
// import './StockCards.css';

// const StockCard = ({ data }) => {
//   const title = data?.title || 'Stock List';
//   const description = data?.description || '';
//   const stocks = data?.quotes || [];

//   return (
//     <div className="stock-card">
//       <div className="stock-header">
//         <div className="header-content">
//           <svg 
//             className="trend-icon"
//             viewBox="0 0 24 24" 
//             fill="none" 
//             stroke="currentColor" 
//             strokeWidth="2"
//           >
//             <circle cx="12" cy="12" r="10"/>
//             <path d="M8 12l3 3 5-5"/>
//           </svg>
//           <h2 className="card-title">{title}</h2>
//         </div>
//         {description && (
//           <p className="card-description">{description}</p>
//         )}
//       </div>

//       <div className="stock-content">
//         {stocks.map((stock) => (
//           <div key={stock.symbol} className="stock-item">
//             <div className="stock-info">
//               <div className="stock-main-info">
//                 <h3 className="stock-name">{stock.shortName}</h3>
//                 <div className="stock-details">
//                   <span>{stock.symbol}</span>
//                   <span className="separator">|</span>
//                   <span>{stock.exchange}</span>
//                 </div>
//               </div>

//               <div className="stock-price-info">
//                 <p className="current-price">
//                   ${stock.regularMarketPrice?.toFixed(2)}
//                 </p>
//                 <div className="price-change">
//                   <span>${stock.regularMarketChange?.toFixed(2)}</span>
//                   <span>
//                     ({stock.regularMarketChangePercent?.toFixed(2)}%)
//                   </span>
//                 </div>
//                 <p className="volume">
//                   Vol: {stock.regularMarketVolume?.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StockCard;

import React,{ useState, useMemo,useEffect } from 'react';
import './StockCards.css';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const StockCard = () => {
  // Hardcoded sample data
  const sampleData = {
    title: "Today's Top Gainers",
    description: "Stocks with the highest percentage gains in today's trading session",
    quotes: [
      {
        symbol: "AAPL",
        shortName: "Apple Inc.",
        exchange: "NASDAQ",
        regularMarketPrice: 189.84,
        regularMarketChange: 5.42,
        regularMarketChangePercent: 2.94,
        regularMarketVolume: 1245678
      },
      {
        symbol: "TSLA",
        shortName: "Tesla, Inc.",
        exchange: "NASDAQ",
        regularMarketPrice: 245.98,
        regularMarketChange: 12.45,
        regularMarketChangePercent: 5.33,
        regularMarketVolume: 987654
      },
      {
        symbol: "MSFT",
        shortName: "Microsoft Corporation",
        exchange: "NASDAQ",
        regularMarketPrice: 378.92,
        regularMarketChange: 8.67,
        regularMarketChangePercent: 2.34,
        regularMarketVolume: 654321
      },
      {
        symbol: "NVDA",
        shortName: "NVIDIA Corporation",
        exchange: "NASDAQ",
        regularMarketPrice: 547.12,
        regularMarketChange: 15.89,
        regularMarketChangePercent: 2.99,
        regularMarketVolume: 789456
      }
    ]
  };
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
      const token = getAuthToken();
      if(token){
        setIsAuthenticated(true);
      }else{
        navigate('/')
      }
    },[]);

  return (
    <div className="stock-card">
      <div className="stock-header">
        <div className="header-content">
          <svg 
            className="trend-icon"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          <h2 className="card-title">{sampleData.title}</h2>
        </div>
        <p className="card-description">{sampleData.description}</p>
      </div>

      <div className="stock-content">
        {sampleData.quotes.map((stock) => (
          <div key={stock.symbol} className="stock-item">
            <div className="stock-info">
              <div className="stock-main-info">
                <h3 className="stock-name">{stock.shortName}</h3>
                <div className="stock-details">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="separator">•</span>
                  <span className="stock-exchange">{stock.exchange}</span>
                </div>
              </div>

              <div className="stock-price-info">
                <p className="current-price">
                  ${stock.regularMarketPrice.toFixed(2)}
                </p>
                <div className="price-change">
                  <span>+${stock.regularMarketChange.toFixed(2)}</span>
                  <span className="percentage">
                    (+{stock.regularMarketChangePercent.toFixed(2)}%)
                  </span>
                </div>
                <p className="volume">
                  Vol: {stock.regularMarketVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;