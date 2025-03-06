
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data for asset allocations
const assetAllocations = [
  { name: 'Bitcoin', value: 35, color: '#F7931A' },
  { name: 'Ethereum', value: 25, color: '#627EEA' },
  { name: 'Solana', value: 15, color: '#00FFA3' },
  { name: 'Stocks', value: 10, color: '#5470C6' },
  { name: 'Cash', value: 15, color: '#91CC75' },
];

export const PortfolioAllocations = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution across asset classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetAllocations}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {assetAllocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Allocation']}
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-2">
          {assetAllocations.map((asset, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                <span>{asset.name}</span>
              </div>
              <div className="font-medium">{asset.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
