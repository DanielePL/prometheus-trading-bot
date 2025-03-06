
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for holdings
const holdings = [
  {
    id: '1',
    asset: 'Bitcoin',
    ticker: 'BTC',
    amount: '1.25',
    price: '$45,230.50',
    value: '$56,538.13',
    allocation: '35%',
    profit: '+$12,342.50',
    profitPercentage: 27.9,
    change24h: 2.3,
  },
  {
    id: '2',
    asset: 'Ethereum',
    ticker: 'ETH',
    amount: '12.5',
    price: '$2,456.75',
    value: '$30,709.38',
    allocation: '25%',
    profit: '+$5,342.30',
    profitPercentage: 21.1,
    change24h: -1.2,
  },
  {
    id: '3',
    asset: 'Solana',
    ticker: 'SOL',
    amount: '150',
    price: '$123.45',
    value: '$18,517.50',
    allocation: '15%',
    profit: '+$3,457.80',
    profitPercentage: 23.0,
    change24h: 5.6,
  },
  {
    id: '4',
    asset: 'S&P 500 ETF',
    ticker: 'SPY',
    amount: '25',
    price: '$452.10',
    value: '$11,302.50',
    allocation: '10%',
    profit: '-$892.75',
    profitPercentage: -7.3,
    change24h: -0.8,
  },
  {
    id: '5',
    asset: 'Cash (USDT)',
    ticker: 'USDT',
    amount: '15,320.35',
    price: '$1.00',
    value: '$15,320.35',
    allocation: '15%',
    profit: '$0.00',
    profitPercentage: 0,
    change24h: 0,
  },
];

export const PortfolioHoldings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredHoldings = holdings.filter(
    (holding) =>
      holding.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Your current asset holdings</CardDescription>
          </div>
          <div className="flex w-full md:w-auto max-w-sm">
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button variant="ghost" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoldings.map((holding) => {
                const isProfitPositive = holding.profitPercentage > 0;
                const isChangePositive = holding.change24h > 0;
                
                return (
                  <TableRow key={holding.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{holding.asset}</div>
                      <div className="text-sm text-muted-foreground">{holding.ticker}</div>
                    </TableCell>
                    <TableCell className="text-right">{holding.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {isChangePositive ? (
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        ) : holding.change24h < 0 ? (
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                        ) : (
                          <span className="mr-5">—</span>
                        )}
                        <span
                          className={
                            isChangePositive
                              ? 'text-green-500'
                              : holding.change24h < 0
                              ? 'text-red-500'
                              : ''
                          }
                        >
                          {holding.change24h > 0 ? '+' : ''}
                          {holding.change24h}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{holding.amount}</TableCell>
                    <TableCell className="text-right font-medium">{holding.value}</TableCell>
                    <TableCell className="text-right">
                      <div className={isProfitPositive ? 'text-green-500' : holding.profitPercentage < 0 ? 'text-red-500' : ''}>
                        {holding.profit}
                      </div>
                      <div className="text-xs">
                        {isProfitPositive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            +{holding.profitPercentage}%
                          </Badge>
                        ) : holding.profitPercentage < 0 ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {holding.profitPercentage}%
                          </Badge>
                        ) : (
                          <Badge variant="outline">0%</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
