
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, Settings, PlayCircle, PauseCircle, AlertCircle, 
  Check, Settings2, Edit, Trash2, Plus 
} from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'backtest';
  performanceScore: number;
  winRate: number;
  profitFactor: number;
  trades: number;
  pairs: string[];
}

const strategies: Strategy[] = [
  {
    id: '1',
    name: 'MACD Crossover',
    description: 'Identifies momentum shifts using MACD indicator crossovers with confirmation from volume',
    status: 'active',
    performanceScore: 82,
    winRate: 68.5,
    profitFactor: 2.3,
    trades: 124,
    pairs: ['BTC/USDT', 'ETH/USDT']
  },
  {
    id: '2',
    name: 'RSI Divergence',
    description: 'Detects potential trend reversals by identifying divergences between price action and RSI',
    status: 'active',
    performanceScore: 75,
    winRate: 61.2,
    profitFactor: 1.8,
    trades: 98,
    pairs: ['SOL/USDT', 'BTC/USDT']
  },
  {
    id: '3',
    name: 'Bull Flag Pattern',
    description: 'Identifies consolidation patterns after strong moves and enters on breakout confirmation',
    status: 'inactive',
    performanceScore: 68,
    winRate: 58.7,
    profitFactor: 1.6,
    trades: 45,
    pairs: ['ETH/USDT']
  },
  {
    id: '4',
    name: 'Bollinger Squeeze',
    description: 'Identifies periods of low volatility and potential breakouts using Bollinger Bands',
    status: 'backtest',
    performanceScore: 0,
    winRate: 0,
    profitFactor: 0,
    trades: 0,
    pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
  }
];

const Strategies = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategies</h1>
            <p className="text-muted-foreground mt-1">
              Manage and configure your Prometheus trading strategies
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            New Strategy
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {strategy.name}
                    </CardTitle>
                    <CardDescription>
                      {strategy.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${strategy.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${strategy.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${strategy.status === 'backtest' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    `}
                  >
                    {strategy.status === 'active' && 'Active'}
                    {strategy.status === 'inactive' && 'Inactive'}
                    {strategy.status === 'backtest' && 'Backtest Mode'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Performance Score</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : `${strategy.performanceScore}%`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Win Rate</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : `${strategy.winRate}%`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Profit Factor</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : strategy.profitFactor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Trades</p>
                    <p className="text-2xl font-bold">{strategy.trades}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Trading Pairs</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.pairs.map((pair) => (
                      <Badge key={pair} variant="secondary">{pair}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/30 px-6 py-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`activate-${strategy.id}`} 
                      checked={strategy.status === 'active'} 
                      disabled={strategy.status === 'backtest'}
                    />
                    <Label htmlFor={`activate-${strategy.id}`}>
                      {strategy.status === 'active' ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Strategies;
