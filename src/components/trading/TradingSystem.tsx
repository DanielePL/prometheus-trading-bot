
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  TrendingUp,
  BarChart2
} from 'lucide-react';

// This component will be used in the future to display trading system metrics and status
export const TradingSystem = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-amber-500" />
          <div>
            <CardTitle>Trading System</CardTitle>
            <CardDescription>Performance metrics and indicators</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">
              Based on last 100 trades
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Profit Factor</h3>
            <div className="text-2xl font-bold">1.73</div>
            <p className="text-xs text-muted-foreground">
              Ratio of gross profits to gross losses
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Average Trade</h3>
            <div className="text-2xl font-bold">$12.85</div>
            <p className="text-xs text-muted-foreground">
              Average profit per trade
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
