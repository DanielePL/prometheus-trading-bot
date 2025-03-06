
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive = true, icon }) => {
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

interface StatsCardsProps {
  portfolioValue: string;
  tradingProfit: string;
  activeBots: number;
  winRate: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  portfolioValue, 
  tradingProfit, 
  activeBots, 
  winRate 
}) => {
  return (
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
  );
};
