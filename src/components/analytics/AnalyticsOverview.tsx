
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const AnalyticsOverview = () => {
  // Mock risk metrics data
  const riskMetrics = [
    { name: 'Max Drawdown', value: '6.2%', description: 'Largest peak-to-trough decline' },
    { name: 'Sharpe Ratio', value: '1.82', description: 'Risk-adjusted return metric' },
    { name: 'Volatility', value: '2.8%', description: 'Daily standard deviation' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Risk Analysis</CardTitle>
          <CardDescription>
            Key risk metrics for your trading strategy
          </CardDescription>
        </div>
        <AlertCircle className="w-4 h-4 ml-auto text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskMetrics.map((metric, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-sm font-medium">{metric.name}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-xs text-muted-foreground">{metric.description}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
