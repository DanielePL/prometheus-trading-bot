
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AnalyticsMetrics = () => {
  // Mock data - would be fetched from API in a production app
  const metrics = [
    {
      title: 'Win Rate',
      value: '68.7%',
      change: 2.1,
      isPositive: true,
      description: 'Compared to last month'
    },
    {
      title: 'Average Profit',
      value: '2.4%',
      change: 0.3,
      isPositive: true,
      description: 'Per winning trade'
    },
    {
      title: 'Average Loss',
      value: '-1.2%',
      change: 0.1,
      isPositive: true,
      description: 'Per losing trade'
    },
    {
      title: 'Profit Factor',
      value: '2.14',
      change: 0.12,
      isPositive: false,
      description: 'Gross profit / gross loss'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`ml-2 flex items-center text-sm ${
                metric.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {metric.change}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
