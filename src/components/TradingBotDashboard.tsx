
import React, { useState, useEffect } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { StatsCards } from './dashboard/StatsCards';
import { PerformanceChart } from './dashboard/PerformanceChart';
import { BotStatus } from './dashboard/BotStatus';
import { RecentTrades } from './dashboard/RecentTrades';

const TradingBotDashboard: React.FC = () => {
  const [botStatus, setBotStatus] = useState('offline');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastSignal, setLastSignal] = useState({ action: 'HOLD', confidence: 0 });
  const [trades, setTrades] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [portfolioValue, setPortfolioValue] = useState('$128,459.32');
  const [tradingProfit, setTradingProfit] = useState('$3,587.21');
  const [activeBots, setActiveBots] = useState(4);
  const [winRate, setWinRate] = useState('68.2%');
  const [botRunning, setBotRunning] = useState(true);
  const [tradingMode, setTradingMode] = useState('Paper Trading');
  const [systemLoad, setSystemLoad] = useState(81);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call to get bot status
    setTimeout(() => {
      setBotStatus('active');
      setCurrentPrice(89540);
      setLastSignal({ action: 'BUY', confidence: 0.73 });
      setTrades([
        { id: 1, time: '2023-06-12 15:30', action: 'BUY', amount: 0.05, price: 88750 },
        { id: 2, time: '2023-06-10 09:15', action: 'SELL', amount: 0.03, price: 90200 }
      ]);
      
      // Generate mock chart data
      const chartData = [];
      let baseValue = 105;
      
      for (let i = 21; i <= 28; i++) {
        baseValue += Math.random() * 3 - 0.5;
        chartData.push({
          date: `Feb ${i}`,
          value: baseValue
        });
      }
      
      for (let i = 1; i <= 6; i++) {
        baseValue += Math.random() * 4;
        chartData.push({
          date: `Mar ${i}`,
          value: baseValue
        });
      }
      
      setPerformanceData(chartData);
    }, 1500);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleBotStatus = () => {
    setBotRunning(!botRunning);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back! Here's an overview of your Prometheus trading bot performance.
            </p>
          </div>
          
          <StatsCards
            portfolioValue={portfolioValue}
            tradingProfit={tradingProfit}
            activeBots={activeBots}
            winRate={winRate}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PerformanceChart
              performanceData={performanceData}
              activeTimeframe={activeTimeframe}
              setActiveTimeframe={setActiveTimeframe}
            />
            
            <BotStatus
              botRunning={botRunning}
              tradingMode={tradingMode}
              systemLoad={systemLoad}
              handleToggleBotStatus={handleToggleBotStatus}
            />
          </div>
          
          <RecentTrades trades={trades} />
        </div>
      </div>
    </div>
  );
};

export default TradingBotDashboard;
