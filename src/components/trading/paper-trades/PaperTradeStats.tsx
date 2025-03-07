
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, BarChart2, History } from 'lucide-react';

interface PaperTradeStatsProps {
  portfolioValue: number;
  balance: number;
  dailyChange: number;
  allTimeProfit: number;
  openPositions: number;
  closedPositions: number;
}

export const PaperTradeStats: React.FC<PaperTradeStatsProps> = ({
  portfolioValue,
  balance,
  dailyChange,
  allTimeProfit,
  openPositions,
  closedPositions
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
              <h3 className="text-2xl font-bold">${portfolioValue.toFixed(2)}</h3>
            </div>
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-2">
            <p className={`text-xs font-medium ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}% today
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
              <h3 className="text-2xl font-bold">${balance.toFixed(2)}</h3>
            </div>
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground">
              Available for trading
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Profit/Loss</p>
              <h3 className={`text-2xl font-bold ${allTimeProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {allTimeProfit >= 0 ? '+' : ''}{allTimeProfit.toFixed(2)}
              </h3>
            </div>
            <TrendingUp className={`h-5 w-5 ${allTimeProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground">
              All-time P&L
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Positions</p>
              <h3 className="text-2xl font-bold">{openPositions} / {openPositions + closedPositions}</h3>
            </div>
            <History className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground">
              Open / Total positions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
