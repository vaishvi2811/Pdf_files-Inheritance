// import { createRoot } from 'react-dom/client'
// import './index.css'
// import {BrowserRouter} from 'react-router-dom'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
// )

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ShopContextProvider>
    <App />
    </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)
