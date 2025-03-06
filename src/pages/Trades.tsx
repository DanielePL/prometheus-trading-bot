
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeftRight, Clock, Filter, 
  TrendingUp, TrendingDown, ArrowDownUp,
  Info, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const initialTrades: Trade[] = [
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
  },
  {
    id: '5',
    pair: 'LINK/USDT',
    strategy: 'Support/Resistance',
    entryPrice: '$14.75',
    exitPrice: null,
    amount: '25 LINK',
    profit: null,
    status: 'open',
    date: '2023-10-19 08:12'
  }
];

const Trades = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [activeTab, setActiveTab] = useState("all");

  const handleClosePosition = (id: string) => {
    const updatedTrades = trades.map(trade => 
      trade.id === id 
        ? { 
            ...trade, 
            status: 'closed' as const, 
            exitPrice: '$' + (parseFloat(trade.entryPrice.substring(1).replace(',', '')) * 1.02).toFixed(2),
            profit: 2.0
          } 
        : trade
    );
    
    setTrades(updatedTrades);
    
    toast({
      title: "Position closed",
      description: "The trade has been successfully closed.",
    });
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Trade details",
      description: `Viewing details for trade #${id}`,
    });
  };

  const filteredTrades = (status?: 'open' | 'closed' | 'pending') => {
    if (!status) return trades;
    return trades.filter(trade => trade.status === status);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your active and past trading positions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowDownUp size={16} />
              Sort
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
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
                      <TableHead className="hidden md:table-cell">Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead className="hidden md:table-cell">Amount</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades().map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.pair}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.strategy}</TableCell>
                        <TableCell>{trade.entryPrice}</TableCell>
                        <TableCell>{trade.exitPrice || '—'}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.amount}</TableCell>
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
                        <TableCell className="hidden md:table-cell">{trade.date}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(trade.id)}
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Details</span>
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
                      <TableHead className="hidden md:table-cell">Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead className="hidden md:table-cell">Amount</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Unrealized P/L</TableHead>
                      <TableHead className="hidden md:table-cell">Date Opened</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades('open').map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.pair}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.strategy}</TableCell>
                        <TableCell>{trade.entryPrice}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.amount}</TableCell>
                        <TableCell>{
                          trade.pair === 'SOL/USDT' ? '$124.82' : 
                          trade.pair === 'LINK/USDT' ? '$14.95' : 
                          trade.entryPrice
                        }</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {trade.pair === 'SOL/USDT' ? (
                              <>
                                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                <span className="text-green-500">+1.1%</span>
                              </>
                            ) : (
                              <>
                                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                <span className="text-green-500">+1.4%</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{trade.date}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => handleClosePosition(trade.id)}
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
            
            {filteredTrades('open').length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No open positions</h3>
                <p className="text-muted-foreground mt-2">
                  You don't have any open trading positions at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="closed" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead className="hidden md:table-cell">Strategy</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead className="hidden md:table-cell">Amount</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                      <TableHead className="hidden md:table-cell">Date Closed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades('closed').map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.pair}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.strategy}</TableCell>
                        <TableCell>{trade.entryPrice}</TableCell>
                        <TableCell>{trade.exitPrice}</TableCell>
                        <TableCell className="hidden md:table-cell">{trade.amount}</TableCell>
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
                        <TableCell className="hidden md:table-cell">{trade.date}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(trade.id)}
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {filteredTrades('closed').length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No closed trades</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't closed any trades yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {filteredTrades().length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <ArrowLeftRight className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No trades found</h3>
            <p className="text-muted-foreground mt-2">
              Your trading bot hasn't made any trades yet.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Trades;
