
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Interfaces for our data types
interface TradeHistory {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  timestamp: string;
  status: string;
  profitLoss: {
    value: string;
    percentage: string;
    isProfit: boolean;
  };
}

interface DepositWithdrawal {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: string;
  currency: string;
  timestamp: string;
  status: string;
  txHash: string;
}

interface SystemEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

// Sample data for trade history
const tradeHistoryData: TradeHistory[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    type: 'buy',
    price: '$45,230.50',
    amount: '0.1 BTC',
    total: '$4,523.05',
    timestamp: '2023-07-15 14:30:22',
    status: 'completed',
    profitLoss: {
      value: '$253.45',
      percentage: '5.6%',
      isProfit: true
    }
  },
  {
    id: '2',
    pair: 'ETH/USDT',
    type: 'sell',
    price: '$2,456.75',
    amount: '1.5 ETH',
    total: '$3,685.13',
    timestamp: '2023-07-12 09:15:43',
    status: 'completed',
    profitLoss: {
      value: '-$124.20',
      percentage: '-3.4%',
      isProfit: false
    }
  },
  {
    id: '3',
    pair: 'SOL/USDT',
    type: 'buy',
    price: '$123.45',
    amount: '20 SOL',
    total: '$2,469.00',
    timestamp: '2023-07-08 18:22:11',
    status: 'completed',
    profitLoss: {
      value: '$782.30',
      percentage: '31.7%',
      isProfit: true
    }
  },
  {
    id: '4',
    pair: 'BTC/USDT',
    type: 'sell',
    price: '$45,150.25',
    amount: '0.05 BTC',
    total: '$2,257.51',
    timestamp: '2023-07-05 11:05:36',
    status: 'completed',
    profitLoss: {
      value: '$105.20',
      percentage: '4.7%',
      isProfit: true
    }
  },
  {
    id: '5',
    pair: 'DOGE/USDT',
    type: 'buy',
    price: '$0.078',
    amount: '5000 DOGE',
    total: '$390.00',
    timestamp: '2023-07-01 16:48:59',
    status: 'completed',
    profitLoss: {
      value: '-$42.30',
      percentage: '-10.8%',
      isProfit: false
    }
  }
];

// Sample data for deposits and withdrawals
const depositWithdrawalData: DepositWithdrawal[] = [
  {
    id: '1',
    type: 'deposit',
    amount: '1.5 BTC',
    currency: 'BTC',
    timestamp: '2023-07-10 08:22:15',
    status: 'completed',
    txHash: '0x8a71b9f5e95b8c7c36c8f74ad5b16dd4'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: '0.5 ETH',
    currency: 'ETH',
    timestamp: '2023-07-07 14:35:41',
    status: 'completed',
    txHash: '0x3f5de8c7a94b5d33f8e75ae6c8753'
  },
  {
    id: '3',
    type: 'deposit',
    amount: '500 USDT',
    currency: 'USDT',
    timestamp: '2023-07-03 11:15:22',
    status: 'completed',
    txHash: '0x9e34d5c7b8a1e6f2d0c9b8a7e5f3d2c1'
  },
  {
    id: '4',
    type: 'deposit',
    amount: '2.2 SOL',
    currency: 'SOL',
    timestamp: '2023-06-28 09:45:10',
    status: 'completed',
    txHash: '0x2e5f8a9d7c6b4e3f2a1d0c9b8a7e6f5'
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: '0.25 BTC',
    currency: 'BTC',
    timestamp: '2023-06-20 16:30:55',
    status: 'completed',
    txHash: '0x5e4f3d2c1b0a9e8f7d6c5b4a3f2e1d0'
  }
];

// Sample data for system events
const systemEventsData: SystemEvent[] = [
  {
    id: '1',
    type: 'Strategy Change',
    description: 'MACD Crossover strategy updated with new parameters',
    timestamp: '2023-07-14 09:22:15',
    severity: 'medium'
  },
  {
    id: '2',
    type: 'System Update',
    description: 'Trading bot updated to version 2.4.1',
    timestamp: '2023-07-10 14:30:42',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'Alert',
    description: 'Unusual market volatility detected for BTC/USDT',
    timestamp: '2023-07-08 02:15:33',
    severity: 'high'
  },
  {
    id: '4',
    type: 'Connection',
    description: 'API connection to Kraken exchange established',
    timestamp: '2023-07-05 11:05:20',
    severity: 'low'
  },
  {
    id: '5',
    type: 'Parameter Change',
    description: 'Risk management parameters updated',
    timestamp: '2023-07-01 16:48:30',
    severity: 'medium'
  }
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = (dataType: string) => {
    toast.success(`Exporting ${dataType} history data...`);
    // In a real app, this would trigger a download of the data
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground mt-1">
            Review all your past trading activities and system events
          </p>
        </div>

        <Tabs defaultValue="trades" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="deposits">Deposits & Withdrawals</TabsTrigger>
              <TabsTrigger value="system">System Events</TabsTrigger>
            </TabsList>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search history..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Most recent</DropdownMenuItem>
                  <DropdownMenuItem>Oldest first</DropdownMenuItem>
                  <DropdownMenuItem>Highest value</DropdownMenuItem>
                  <DropdownMenuItem>Lowest value</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle>Trade History</CardTitle>
                  <CardDescription>Complete record of all your bot's trading activities</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleExport('trade')}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pair</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden md:table-cell">Price</TableHead>
                        <TableHead className="hidden md:table-cell">Amount</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                        <TableHead>P/L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistoryData.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.pair}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                trade.type === 'buy'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }
                            >
                              {trade.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{trade.price}</TableCell>
                          <TableCell className="hidden md:table-cell">{trade.amount}</TableCell>
                          <TableCell>{trade.total}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="whitespace-nowrap">{trade.timestamp}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {trade.profitLoss.isProfit ? (
                                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={
                                  trade.profitLoss.isProfit
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                {trade.profitLoss.value} ({trade.profitLoss.percentage})
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle>Deposits & Withdrawals</CardTitle>
                  <CardDescription>Record of all fund movements</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleExport('deposit/withdrawal')}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                        <TableHead className="hidden lg:table-cell">Transaction Hash</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depositWithdrawalData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.type === 'deposit'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }
                            >
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.amount}</TableCell>
                          <TableCell>{item.currency}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="whitespace-nowrap">{item.timestamp}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-xs font-mono">{item.txHash}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle>System Events</CardTitle>
                  <CardDescription>Record of all system activities and alerts</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleExport('system event')}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemEventsData.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.type}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="whitespace-nowrap">{event.timestamp}</span>
                          </TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                event.severity === 'high'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : event.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              }
                            >
                              {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
