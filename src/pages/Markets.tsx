
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, Minus, Star, Clock } from 'lucide-react';

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  volume: string;
  marketCap: string;
  tracked: boolean;
}

const marketData: MarketData[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: '$45,230.50', change24h: 2.34, volume: '$28.5B', marketCap: '$856.7B', tracked: true },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: '$2,456.75', change24h: -1.21, volume: '$15.2B', marketCap: '$295.4B', tracked: true },
  { id: '3', symbol: 'SOL', name: 'Solana', price: '$123.45', change24h: 5.67, volume: '$4.8B', marketCap: '$53.1B', tracked: true },
  { id: '4', symbol: 'BNB', name: 'Binance Coin', price: '$312.80', change24h: 0.58, volume: '$1.2B', marketCap: '$48.3B', tracked: false },
  { id: '5', symbol: 'ADA', name: 'Cardano', price: '$0.52', change24h: -2.35, volume: '$980M', marketCap: '$18.2B', tracked: false },
  { id: '6', symbol: 'XRP', name: 'Ripple', price: '$0.56', change24h: -0.87, volume: '$1.5B', marketCap: '$29.8B', tracked: false },
  { id: '7', symbol: 'DOT', name: 'Polkadot', price: '$6.78', change24h: 1.45, volume: '$420M', marketCap: '$8.5B', tracked: false },
  { id: '8', symbol: 'DOGE', name: 'Dogecoin', price: '$0.087', change24h: 3.21, volume: '$890M', marketCap: '$12.3B', tracked: false },
];

const Markets = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1">
            Monitor crypto markets and manage your tracked assets
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Markets</TabsTrigger>
              <TabsTrigger value="tracked">Tracked</TabsTrigger>
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search markets..." className="pl-8" />
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Asset</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData.map((market) => (
                      <TableRow key={market.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell className="font-medium">{market.symbol}</TableCell>
                        <TableCell>{market.name}</TableCell>
                        <TableCell>{market.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {market.change24h > 0 ? (
                              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            ) : market.change24h < 0 ? (
                              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                            ) : (
                              <Minus className="mr-1 h-4 w-4 text-muted-foreground" />
                            )}
                            <span
                              className={
                                market.change24h > 0
                                  ? 'text-green-500'
                                  : market.change24h < 0
                                  ? 'text-red-500'
                                  : 'text-muted-foreground'
                              }
                            >
                              {market.change24h > 0 ? '+' : ''}
                              {market.change24h}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{market.volume}</TableCell>
                        <TableCell className="hidden lg:table-cell">{market.marketCap}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={market.tracked ? "default" : "outline"} 
                            size="sm"
                            className={market.tracked ? "bg-primary" : ""}
                          >
                            {market.tracked ? "Tracked" : "Track"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracked" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Asset</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData.filter(market => market.tracked).map((market) => (
                      <TableRow key={market.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell className="font-medium">{market.symbol}</TableCell>
                        <TableCell>{market.name}</TableCell>
                        <TableCell>{market.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {market.change24h > 0 ? (
                              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            ) : market.change24h < 0 ? (
                              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                            ) : (
                              <Minus className="mr-1 h-4 w-4 text-muted-foreground" />
                            )}
                            <span
                              className={
                                market.change24h > 0
                                  ? 'text-green-500'
                                  : market.change24h < 0
                                  ? 'text-red-500'
                                  : 'text-muted-foreground'
                              }
                            >
                              {market.change24h > 0 ? '+' : ''}
                              {market.change24h}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{market.volume}</TableCell>
                        <TableCell className="hidden lg:table-cell">{market.marketCap}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Untrack
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gainers" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Asset</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData.filter(market => market.change24h > 0).sort((a, b) => b.change24h - a.change24h).map((market) => (
                      <TableRow key={market.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell className="font-medium">{market.symbol}</TableCell>
                        <TableCell>{market.name}</TableCell>
                        <TableCell>{market.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">
                              +{market.change24h}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{market.volume}</TableCell>
                        <TableCell className="hidden lg:table-cell">{market.marketCap}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={market.tracked ? "default" : "outline"} 
                            size="sm"
                            className={market.tracked ? "bg-primary" : ""}
                          >
                            {market.tracked ? "Tracked" : "Track"}
                          </Button>
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

export default Markets;
