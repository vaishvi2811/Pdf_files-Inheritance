// StockDetail.jsx
import React, {useState, useMemo,useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart2, Activity, Globe, DollarSign, TrendingDown, Percent, Clock } from 'lucide-react';
import './StockPage.css';
import { getAuthToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const chartData = [
    { date: '2024-01-20', price: 150.20 },
    { date: '2024-01-21', price: 152.50 },
    { date: '2024-01-22', price: 148.30 },
    { date: '2024-01-23', price: 153.80 },

    
    { date: '2024-01-24', price: 155.90 },
    { date: '2024-01-25', price: 154.20 },
    { date: '2024-01-26', price: 156.70 }
];

const StockDetail = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const navigate=useNavigate();

    useEffect(()=>{
            const token = getAuthToken();
            if(token){
              setIsAuthenticated(true);
            }else{
              navigate('/')
            }
          },[]);
          
    return (
        <div className="stock-detail-container">
            <div className="stock-container">
                {/* Header */}
                <div className="header-card">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="w-8 h-8 icon" />
                        <div>
                            <h1 className="text-2xl font-bold title">Apple Inc. (AAPL)</h1>
                            <div className="flex items-center gap-2 subtitle text-sm">
                                <span>NASDAQ</span>
                                <span>|</span>
                                <span className="positive">+2.50 (+1.62%)</span>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <p className="text-3xl font-bold title">$156.70</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="summary-stats">
                    {[
                        { icon: <DollarSign />, label: 'Market Cap', value: '2.45T' },
                        { icon: <Activity />, label: 'Volume', value: '52.3M' },
                        { icon: <Percent />, label: 'P/E Ratio', value: '28.5' },
                        { icon: <Clock />, label: 'Trading Time', value: 'Live' }
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

                {/* Main Content */}
                <div className="chart-section">
                    <div className="chart-card">
                        <h2 className="text-lg font-semibold title mb-4">Price History</h2>
                        <div className="chart-container">
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(159, 255, 203, 0.1)" />
                                    <XAxis dataKey="date" stroke="#9FFFCB" />
                                    <YAxis stroke="#9FFFCB" />
                                    <Tooltip contentStyle={{
                                        backgroundColor: '#004E64',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }} />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#00A5CF"
                                        strokeWidth={2}
                                        dot={{ fill: '#00A5CF' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Side Metrics */}
                <div className="metrics-section">
                    <div className="metric-card">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart2 className="w-5 h-5 icon" />
                            <h3 className="text-base font-semibold title">OHLC Values</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Open', value: '$154.20' },
                                { label: 'High', value: '$157.80' },
                                { label: 'Low', value: '$153.50' },
                                { label: 'Close', value: '$156.70' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="subtitle text-xs">{item.label}</p>
                                    <p className="value text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="flex items-center gap-3 mb-3">
                            <Globe className="w-5 h-5 icon" />
                            <h3 className="text-base font-semibold title">Key Metrics</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: '52W High', value: '$182.50' },
                                { label: '52W Low', value: '$124.30' },
                                { label: 'Avg Volume', value: '48.7M' }
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between">
                                    <p className="subtitle text-xs">{item.label}</p>
                                    <p className="value text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetail;