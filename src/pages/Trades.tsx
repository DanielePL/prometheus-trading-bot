
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  strategy: string;
  entryPrice: string;
  exitPrice: string | null;
  amount: string;
  profit: number | null;
  status: 'open' | 'closed' | 'pending';
  date: string;
}

const trades: Trade[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    strategy: 'MACD Crossover',
    entryPrice: '$45,230.50',
    exitPrice: '$46,125.75',
    amount: '0.05 BTC',
    profit: 3.2,
    status: 'closed',
    date: '2023-10-15 14:23'
  },
  {
    id: '2',
    pair: 'ETH/USDT',
    strategy: 'RSI Divergence',
    entryPrice: '$2,456.75',
    exitPrice: '$2,410.25',
    amount: '0.8 ETH',
    profit: -1.9,
    status: 'closed',
    date: '2023-10-16 09:45'
  },
  {
    id: '3',
    pair: 'SOL/USDT',
    strategy: 'Bull Flag Pattern',
    entryPrice: '$123.45',
    exitPrice: null,
    amount: '4.5 SOL',
    profit: null,
    status: 'open',
    date: '2023-10-18 11:32'
  },
  {
    id: '4',
    pair: 'BTC/USDT',
    strategy: 'Bollinger Squeeze',
    entryPrice: '$46,780.25',
    exitPrice: null,
    amount: '0.02 BTC',
    profit: null,
    status: 'pending',
    date: '2023-10-18 16:05'
  }
];

const Trades = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your active and past trading positions
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Trades</TabsTrigger>
            <TabsTrigger value="open">Open Positions</TabsTrigger>
            <TabsTrigger value="closed">Closed Trades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.pair}</TableCell>
                        <TableCell>{trade.strategy}</TableCell>
                        <TableCell>{trade.entryPrice}</TableCell>
                        <TableCell>{trade.exitPrice || '—'}</TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>
                          {trade.profit !== null ? (
                            <div className="flex items-center">
                              {trade.profit > 0 ? (
                                <>
                                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                  <span className="text-green-500">+{trade.profit}%</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">{trade.profit}%</span>
                                </>
                              )}
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${trade.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                              ${trade.status === 'closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                              ${trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                            `}
                          >
                            {trade.status === 'open' && 'Open'}
                            {trade.status === 'closed' && 'Closed'}
                            {trade.status === 'pending' && 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.date}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={trade.status === 'closed'}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="open" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Unrealized P/L</TableHead>
                      <TableHead>Date Opened</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades
                      .filter((trade) => trade.status === 'open')
                      .map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.pair}</TableCell>
                          <TableCell>{trade.strategy}</TableCell>
                          <TableCell>{trade.entryPrice}</TableCell>
                          <TableCell>{trade.amount}</TableCell>
                          <TableCell>$124.82</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                              <span className="text-green-500">+1.1%</span>
                            </div>
                          </TableCell>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              Close Position
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="closed" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                      <TableHead>Date Closed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades
                      .filter((trade) => trade.status === 'closed')
                      .map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.pair}</TableCell>
                          <TableCell>{trade.strategy}</TableCell>
                          <TableCell>{trade.entryPrice}</TableCell>
                          <TableCell>{trade.exitPrice}</TableCell>
                          <TableCell>{trade.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {trade.profit && trade.profit > 0 ? (
                                <>
                                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                  <span className="text-green-500">+{trade.profit}%</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">{trade.profit}%</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Trades;
