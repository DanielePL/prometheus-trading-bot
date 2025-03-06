
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Track your trading performance over time</CardDescription>
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
                <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
                <span>Performance</span>
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
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, fill: 'var(--background)' }}
                    activeDot={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, r: 6, fill: 'hsl(var(--accent))' }}
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
