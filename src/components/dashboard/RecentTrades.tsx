
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Trade {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

const recentTrades: Trade[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    type: 'buy',
    price: '$45,230.50',
    amount: '0.1 BTC',
    total: '$4,523.05',
    time: '2 min ago',
    status: 'completed',
  },
  {
    id: '2',
    pair: 'ETH/USDT',
    type: 'sell',
    price: '$2,456.75',
    amount: '1.5 ETH',
    total: '$3,685.13',
    time: '15 min ago',
    status: 'completed',
  },
  {
    id: '3',
    pair: 'SOL/USDT',
    type: 'buy',
    price: '$123.45',
    amount: '20 SOL',
    total: '$2,469.00',
    time: '1 hour ago',
    status: 'completed',
  },
  {
    id: '4',
    pair: 'BTC/USDT',
    type: 'sell',
    price: '$45,150.25',
    amount: '0.05 BTC',
    total: '$2,257.51',
    time: '3 hours ago',
    status: 'completed',
  },
];

export const RecentTrades = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Latest trading activity from your bot</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/trades" className="flex items-center gap-1">
            <span>View all</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  trade.type === 'buy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {trade.type === 'buy' ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {trade.pair}{' '}
                    <span className={trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{trade.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{trade.total}</div>
                <div className="text-sm text-muted-foreground">
                  {trade.amount} @ {trade.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
