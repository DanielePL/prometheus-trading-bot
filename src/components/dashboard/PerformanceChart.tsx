
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  performanceData: any[];
  activeTimeframe: string;
  setActiveTimeframe: (timeframe: string) => void;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  performanceData,
  activeTimeframe,
  setActiveTimeframe
}) => {
  return (
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
  );
};
