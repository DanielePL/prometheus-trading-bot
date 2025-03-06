
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, BarChart2, 
  Globe, Clock, Settings, LogOut, Menu, 
  PieChart, Database, CheckCircle, AlertCircle, 
  RefreshCw, DollarSign, ArrowUpRight, User, Layers
} from 'lucide-react';

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
  
  // Sample data for chart
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  
  // Mock data - in a real implementation, this would come from your Python backend
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
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-700">
          <Globe className="text-indigo-600 dark:text-indigo-400 mr-2" size={24} />
          {isMenuOpen && <h1 className="text-xl font-bold">Prometheus</h1>}
          <button 
            className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={toggleMenu}
          >
            <Menu size={18} />
          </button>
        </div>
        
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          {isMenuOpen && <span>Dashboard</span>}
        </div>
        
        <nav className="flex-1">
          <SidebarItem icon={<Activity size={18} />} text="Overview" isOpen={isMenuOpen} isActive={true} />
          <SidebarItem icon={<TrendingUp size={18} />} text="Performance" isOpen={isMenuOpen} />
          <SidebarItem icon={<BarChart2 size={18} />} text="Markets" isOpen={isMenuOpen} />
          <SidebarItem icon={<Database size={18} />} text="Cloud" isOpen={isMenuOpen} />
          
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium mt-4">
            {isMenuOpen && <span>Trading</span>}
          </div>
          
          <SidebarItem icon={<Activity size={18} />} text="Strategies" isOpen={isMenuOpen} />
          <SidebarItem icon={<RefreshCw size={18} />} text="Trades" isOpen={isMenuOpen} />
          <SidebarItem icon={<Clock size={18} />} text="History" isOpen={isMenuOpen} />
          <SidebarItem icon={<PieChart size={18} />} text="Analytics" isOpen={isMenuOpen} />
          
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium mt-4">
            {isMenuOpen && <span>Account</span>}
          </div>
          
          <SidebarItem icon={<DollarSign size={18} />} text="Portfolio" isOpen={isMenuOpen} />
          <SidebarItem icon={<Layers size={18} />} text="Assets" isOpen={isMenuOpen} />
          <SidebarItem icon={<Database size={18} />} text="Deposits" isOpen={isMenuOpen} />
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-700">
          <SidebarItem icon={<User size={18} />} text="Profile" isOpen={isMenuOpen} />
          <SidebarItem icon={<Settings size={18} />} text="Settings" isOpen={isMenuOpen} />
          <SidebarItem icon={<LogOut size={18} />} text="Logout" isOpen={isMenuOpen} />
          
          {isMenuOpen && (
            <div className="text-xs text-gray-400 mt-4">
              v1.0.0
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back! Here's an overview of your Prometheus trading bot performance.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Portfolio Value" 
              value={portfolioValue} 
              change="3.2%" 
              isPositive={true} 
              icon={<DollarSign className="text-indigo-500" size={20} />} 
            />
            
            <StatsCard 
              title="Trading Profit (30d)" 
              value={tradingProfit} 
              change="5.8%" 
              isPositive={true} 
              icon={<TrendingUp className="text-green-500" size={20} />} 
            />
            
            <StatsCard 
              title="Active Bots" 
              value={activeBots.toString()} 
              icon={<Activity className="text-blue-500" size={20} />} 
            />
            
            <StatsCard 
              title="Win Rate" 
              value={winRate} 
              change="1.4%" 
              isPositive={true} 
              icon={<ArrowUpRight className="text-emerald-500" size={20} />} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart and timeframe selection */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Performance Overview</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Track your trading performance over time</p>
                </div>
                <div className="flex space-x-2 text-sm">
                  {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((timeframe) => (
                    <button
                      key={timeframe}
                      className={`px-3 py-1 rounded-md ${
                        activeTimeframe === timeframe
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTimeframe(timeframe)}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64">
                {performanceData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date"
                        stroke="#888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#888" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Bot Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Prometheus Status</h2>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Current trading bot status</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bot Control</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="w-0 h-0 opacity-0"
                      checked={botRunning}
                      onChange={handleToggleBotStatus}
                    />
                    <label
                      htmlFor="toggle"
                      className={`absolute top-0 left-0 right-0 bottom-0 block rounded-full cursor-pointer ${
                        botRunning ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute left-1 bottom-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          botRunning ? 'transform translate-x-6' : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                  <span className="ml-2 text-sm font-medium">Running</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Trading Mode</span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                    {tradingMode}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">System Load</span>
                    <span className="text-sm font-medium">{systemLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${systemLoad}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <StatusItem 
                    icon={<CheckCircle size={16} className="text-green-500" />} 
                    text="Connected to Kraken API" 
                  />
                  <StatusItem 
                    icon={<CheckCircle size={16} className="text-green-500" />} 
                    text="ML model loaded" 
                  />
                  <StatusItem 
                    icon={<AlertCircle size={16} className="text-blue-500" />} 
                    text="Last signal: BUY (0.73 confidence)" 
                  />
                  <StatusItem 
                    icon={<AlertCircle size={16} className="text-yellow-500" />} 
                    text="Social sentiment: Neutral" 
                  />
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
                    <AlertCircle size={16} className="mr-1" /> Stop Bot
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-sm">
                    <RefreshCw size={16} className="mr-1" /> Train Model
                  </button>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    <Clock size={16} className="mr-1" /> Historical Data
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    <Activity size={16} className="mr-1" /> View Logs
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                <h3 className="text-sm font-medium mb-2">Prometheus Trade Bot status</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bot is running and monitoring markets
                </p>
              </div>
            </div>
          </div>
          
          {/* Recent Trades Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold">Recent Trades</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {trades.length > 0 ? (
                    trades.map((trade: any) => (
                      <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.time}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.amount} BTC</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.price.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No trades yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  isActive?: boolean;
}> = ({ icon, text, isOpen, isActive = false }) => {
  return (
    <div 
      className={`flex items-center py-2 px-4 ${
        isActive 
          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      } transition-colors cursor-pointer`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isOpen && <span className="ml-3 text-sm font-medium">{text}</span>}
    </div>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}> = ({ title, value, change, isPositive = true, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <div className="flex items-center mt-1">
              <span className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {change} vs last period
              </span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusItem: React.FC<{
  icon: React.ReactNode;
  text: string;
}> = ({ icon, text }) => {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default TradingBotDashboard;
