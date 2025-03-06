
import React from 'react';
import { CheckCircle, AlertCircle, Clock, Activity, RefreshCw } from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  text: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

interface BotStatusProps {
  botRunning: boolean;
  tradingMode: string;
  systemLoad: number;
  handleToggleBotStatus: () => void;
}

export const BotStatus: React.FC<BotStatusProps> = ({
  botRunning,
  tradingMode,
  systemLoad,
  handleToggleBotStatus
}) => {
  return (
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
  );
};
