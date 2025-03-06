
import React, { useState, useEffect } from 'react';

// This component represents a dashboard for the Python trading bot
// In a real implementation, you'd set up API endpoints to communicate with your Python backend
const TradingBotDashboard: React.FC = () => {
  const [botStatus, setBotStatus] = useState('offline');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastSignal, setLastSignal] = useState({ action: 'HOLD', confidence: 0 });
  const [trades, setTrades] = useState([]);
  
  // Mock data - in a real implementation, this would come from your Python backend
  useEffect(() => {
    // Simulate API call to get bot status
    setTimeout(() => {
      setBotStatus('online');
      setCurrentPrice(89540);
      setLastSignal({ action: 'BUY', confidence: 0.78 });
      setTrades([
        { id: 1, time: '2023-06-12 15:30', action: 'BUY', amount: 0.05, price: 88750 },
        { id: 2, time: '2023-06-10 09:15', action: 'SELL', amount: 0.03, price: 90200 }
      ]);
    }, 1500);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Trading Bot Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Bot Status</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${botStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="capitalize">{botStatus}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Current BTC Price</h2>
          <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Latest Signal</h2>
          <div className={`font-bold ${lastSignal.action === 'BUY' ? 'text-green-500' : lastSignal.action === 'SELL' ? 'text-red-500' : 'text-gray-500'}`}>
            {lastSignal.action}
          </div>
          <div className="text-sm">Confidence: {(lastSignal.confidence * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trades.length > 0 ? (
                trades.map((trade: any) => (
                  <tr key={trade.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.time}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.amount} BTC</td>
                    <td className="px-6 py-4 whitespace-nowrap">${trade.price.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No trades yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Your trading bot is configured through the config.yaml file. Make changes to this file to adjust your trading parameters.
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
          <pre className="text-sm overflow-x-auto">
{`exchanges:
  kraken:
    api_key: your_api_key
    secret: your_api_secret

risk_params:
  max_position_size: 0.1
  stop_loss_pct: 0.05
  take_profit_pct: 0.1
  max_daily_trades: 3`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TradingBotDashboard;
