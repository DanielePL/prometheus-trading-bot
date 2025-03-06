
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, BarChart2 } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, 
  Pie, Cell
} from 'recharts';

// Mock data for charts
const profitLossData = [
  { day: 'Mon', value: 220 },
  { day: 'Tue', value: -120 },
  { day: 'Wed', value: 340 },
  { day: 'Thu', value: 180 },
  { day: 'Fri', value: -90 },
  { day: 'Sat', value: 140 },
  { day: 'Sun', value: 250 },
];

const strategyData = [
  { name: 'Trend Following', value: 45 },
  { name: 'Mean Reversion', value: 25 },
  { name: 'Breakout', value: 15 },
  { name: 'Arbitrage', value: 10 },
  { name: 'Other', value: 5 },
];

const cumulativeReturnData = Array.from({ length: 30 }).map((_, i) => {
  const volatility = 0.7;
  const trend = i * 0.2;
  const random = (Math.random() - 0.5) * volatility;
  const base = 10000;
  const dayValue = base * (1 + (trend + random) / 100);
  
  return {
    day: i + 1,
    value: Math.round(dayValue),
  };
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsCharts = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
  
  // Custom tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className={`${payload[0].value >= 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
            ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="strategies">Strategies</TabsTrigger>
        <TabsTrigger value="assets">Assets</TabsTrigger>
        <TabsTrigger value="timeframes">Timeframes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Profit and Loss</CardTitle>
              <CardDescription>Daily PnL for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Profit/Loss">
                    {profitLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Performance by Strategy</CardTitle>
              <CardDescription>Total profit distribution across strategies</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={strategyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {strategyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Return</CardTitle>
            <CardDescription>Growth of $10,000 invested at bot launch</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeReturnData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip formatter={(value) => `$${value}`} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/30)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="strategies" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Performance</CardTitle>
            <CardDescription>Comparison of all trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
              <BarChart2 className="h-10 w-10 text-muted" />
              <span className="ml-2 text-muted-foreground">Detailed strategy comparison charts</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="assets" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Asset Performance</CardTitle>
            <CardDescription>Profit and loss by cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
              <BarChart className="h-10 w-10 text-muted" />
              <span className="ml-2 text-muted-foreground">Asset performance charts</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="timeframes" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Time-Based Analysis</CardTitle>
            <CardDescription>Performance by time of day, day of week, and month</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
              <LineChart className="h-10 w-10 text-muted" />
              <span className="ml-2 text-muted-foreground">Time-based performance charts</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
