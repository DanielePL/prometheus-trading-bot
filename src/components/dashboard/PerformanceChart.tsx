
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Bitcoin } from 'lucide-react';

// Mock data for chart
const generateData = (days: number, baseValue: number, volatility: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    // Create some random but somewhat trending data
    const randomFactor = Math.random() * volatility - volatility/2;
    const trendFactor = i * 0.02 * baseValue; // slight upward trend
    const value = baseValue + trendFactor + randomFactor;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(2))
    };
  });
};

const performanceData = {
  daily: generateData(14, 100, 5),
  weekly: generateData(12, 98, 8),
  monthly: generateData(12, 92, 12),
  yearly: generateData(12, 85, 15),
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border p-2 rounded-lg shadow-md text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-accent font-semibold">
          Value: ${payload[0].value?.toString()}
        </p>
      </div>
    );
  }
  
  return null;
};

export const PerformanceChart = () => {
  return (
    <Card className="col-span-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bitcoin Performance</CardTitle>
            <CardDescription>Track your BTC trading performance over time</CardDescription>
          </div>
          <div className="flex items-center bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full">
            <Bitcoin className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">BTC-USD</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center text-sm">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                <span>Bitcoin</span>
              </div>
            </div>
          </div>
          
          {Object.entries(performanceData).map(([period, data]) => (
            <TabsContent key={period} value={period} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b" // Bitcoin orange
                    strokeWidth={2}
                    dot={{ stroke: '#f59e0b', strokeWidth: 2, fill: 'var(--background)' }}
                    activeDot={{ stroke: '#f59e0b', strokeWidth: 2, r: 6, fill: '#f59e0b' }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
