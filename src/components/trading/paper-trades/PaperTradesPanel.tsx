
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Download, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaperTradeStats } from './PaperTradeStats';
import { PaperTradeHistory } from './PaperTradeHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface PaperTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  currentPrice: number | null;
  profit: number | null;
  profitPercentage: number | null;
  timestamp: number;
}

export interface ClosedTrade extends PaperTrade {
  closedAt: number;
  closedPrice: number;
  finalProfit: number;
  finalProfitPercentage: number;
}

export const PaperTradesPanel: React.FC = () => {
  const [trades, setTrades] = useState<PaperTrade[]>(() => {
    const savedTrades = localStorage.getItem('paperTrades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>(() => {
    const savedClosedTrades = localStorage.getItem('closedPaperTrades');
    return savedClosedTrades ? JSON.parse(savedClosedTrades) : [];
  });
  
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('paperTradeBalance');
    return savedBalance ? parseFloat(savedBalance) : 100000;
  });
  
  const [symbol, setSymbol] = useState('BTC-USD');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  
  const { toast } = useToast();
  
  // Portfolio performance metrics
  const [portfolioValue, setPortfolioValue] = useState<number>(balance);
  const [dailyChange, setDailyChange] = useState<number>(0);
  const [allTimeProfit, setAllTimeProfit] = useState<number>(0);
  
  // Simulate current prices for demo
  const getCurrentPrice = (symbol: string) => {
    const basePrices: Record<string, number> = {
      'BTC-USD': 65000,
      'ETH-USD': 3500,
      'SOL-USD': 145,
      'DOGE-USD': 0.12,
      'ADA-USD': 0.45,
    };
    
    const basePrice = basePrices[symbol] || 100;
    // Add some randomness to simulate price movement
    return basePrice * (1 + (Math.random() * 0.02 - 0.01));
  };
  
  // Update current prices and profit calculations
  const updatePrices = () => {
    const updatedTrades = trades.map(trade => {
      const currentPrice = getCurrentPrice(trade.symbol);
      let profit = 0;
      let profitPercentage = 0;
      
      if (trade.type === 'buy') {
        profit = (currentPrice - trade.price) * trade.amount;
        profitPercentage = (currentPrice / trade.price - 1) * 100;
      } else {
        profit = (trade.price - currentPrice) * trade.amount;
        profitPercentage = (trade.price / currentPrice - 1) * 100;
      }
      
      return {
        ...trade,
        currentPrice,
        profit,
        profitPercentage
      };
    });
    
    setTrades(updatedTrades);
    localStorage.setItem('paperTrades', JSON.stringify(updatedTrades));
    
    // Update portfolio value
    const totalTradeValue = updatedTrades.reduce((sum, trade) => {
      if (trade.currentPrice) {
        return sum + (trade.currentPrice * trade.amount);
      }
      return sum;
    }, 0);
    
    const totalPnL = updatedTrades.reduce((sum, trade) => {
      return sum + (trade.profit || 0);
    }, 0);
    
    setPortfolioValue(balance + totalTradeValue);
    setDailyChange(Math.random() * 5 - 2); // Simulate daily change
    setAllTimeProfit(closedTrades.reduce((sum, trade) => sum + trade.finalProfit, 0) + totalPnL);
  };
  
  // Initialize and update prices periodically
  useEffect(() => {
    // Initial update
    updatePrices();
    
    // Set up interval for updates
    const interval = setInterval(updatePrices, 5000);
    
    return () => clearInterval(interval);
  }, [trades.length, balance, closedTrades.length]);
  
  const executeTrade = () => {
    if (!amount || !price) {
      toast({
        title: "Invalid Trade",
        description: "Please enter both amount and price",
        variant: "destructive"
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    const priceValue = parseFloat(price);
    
    if (isNaN(amountValue) || isNaN(priceValue) || amountValue <= 0 || priceValue <= 0) {
      toast({
        title: "Invalid Values",
        description: "Amount and price must be positive numbers",
        variant: "destructive"
      });
      return;
    }
    
    const totalValue = priceValue * amountValue;
    
    // Check if user has enough balance for buy orders
    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${totalValue.toFixed(2)} but only have $${balance.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }
    
    const currentPrice = getCurrentPrice(symbol);
    const newTrade: PaperTrade = {
      id: Date.now().toString(),
      symbol,
      type: tradeType,
      price: priceValue,
      amount: amountValue,
      total: totalValue,
      currentPrice,
      profit: 0,
      profitPercentage: 0,
      timestamp: Date.now()
    };
    
    // Update balance
    if (tradeType === 'buy') {
      setBalance(prev => prev - totalValue);
    } else {
      setBalance(prev => prev + totalValue);
    }
    
    const updatedTrades = [...trades, newTrade];
    setTrades(updatedTrades);
    
    // Save to localStorage
    localStorage.setItem('paperTrades', JSON.stringify(updatedTrades));
    localStorage.setItem('paperTradeBalance', balance.toString());
    
    toast({
      title: `Paper ${tradeType === 'buy' ? 'Buy' : 'Sell'} Executed`,
      description: `${amountValue} ${symbol.split('-')[0]} at $${priceValue.toFixed(2)}`,
      variant: tradeType === 'buy' ? 'default' : 'destructive'
    });
    
    // Reset form
    setAmount('');
    setPrice('');
  };
  
  const closePosition = (id: string) => {
    const tradeIndex = trades.findIndex(t => t.id === id);
    if (tradeIndex === -1) return;
    
    const trade = trades[tradeIndex];
    const currentPrice = getCurrentPrice(trade.symbol);
    
    let profit = 0;
    let profitPercentage = 0;
    
    if (trade.type === 'buy') {
      profit = (currentPrice - trade.price) * trade.amount;
      profitPercentage = (currentPrice / trade.price - 1) * 100;
      setBalance(prev => prev + (currentPrice * trade.amount));
    } else {
      profit = (trade.price - currentPrice) * trade.amount;
      profitPercentage = (trade.price / currentPrice - 1) * 100;
      setBalance(prev => prev - (currentPrice * trade.amount));
    }
    
    // Create closed trade record
    const closedTrade: ClosedTrade = {
      ...trade,
      closedAt: Date.now(),
      closedPrice: currentPrice,
      finalProfit: profit,
      finalProfitPercentage: profitPercentage
    };
    
    const updatedClosedTrades = [...closedTrades, closedTrade];
    setClosedTrades(updatedClosedTrades);
    
    toast({
      title: "Position Closed",
      description: `Realized P&L: ${profit > 0 ? '+' : ''}$${profit.toFixed(2)}`,
      variant: profit >= 0 ? "default" : "destructive"
    });
    
    const updatedTrades = trades.filter(t => t.id !== id);
    setTrades(updatedTrades);
    
    // Update localStorage
    localStorage.setItem('paperTrades', JSON.stringify(updatedTrades));
    localStorage.setItem('closedPaperTrades', JSON.stringify(updatedClosedTrades));
    localStorage.setItem('paperTradeBalance', balance.toString());
  };
  
  const clearAllTrades = () => {
    if (window.confirm('Are you sure you want to clear all paper trades and reset your balance?')) {
      setTrades([]);
      setClosedTrades([]);
      setBalance(100000);
      localStorage.removeItem('paperTrades');
      localStorage.removeItem('closedPaperTrades');
      localStorage.setItem('paperTradeBalance', '100000');
      toast({
        title: "All Trades Cleared",
        description: "Your paper trading history has been reset with $100,000 balance",
      });
    }
  };
  
  const refreshPrices = () => {
    updatePrices();
    toast({
      title: "Prices Updated",
      description: "Latest market prices have been fetched",
    });
  };
  
  const exportTrades = () => {
    const allTradeData = {
      openTrades: trades,
      closedTrades: closedTrades,
      balance: balance,
      portfolioValue: portfolioValue,
      allTimeProfit: allTimeProfit,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allTradeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'paper-trades-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Trades Exported",
      description: "Your paper trade data has been exported successfully",
    });
  };
  
  const tradingPairs = [
    { value: 'BTC-USD', label: 'Bitcoin/USD' },
    { value: 'ETH-USD', label: 'Ethereum/USD' },
    { value: 'SOL-USD', label: 'Solana/USD' },
    { value: 'DOGE-USD', label: 'Dogecoin/USD' },
    { value: 'ADA-USD', label: 'Cardano/USD' },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Paper Trading</CardTitle>
            <CardDescription>Simulate trades without using real funds</CardDescription>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Balance: ${balance.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaperTradeStats 
          portfolioValue={portfolioValue} 
          balance={balance} 
          dailyChange={dailyChange} 
          allTimeProfit={allTimeProfit}
          openPositions={trades.length}
          closedPositions={closedTrades.length}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="open">Open Positions</TabsTrigger>
            <TabsTrigger value="new">New Trade</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={refreshPrices}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Prices
              </Button>
              <Button variant="outline" size="sm" onClick={exportTrades}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            {trades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.symbol.split('-')[0]}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={trade.type === 'buy' 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {trade.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>${trade.price.toFixed(2)}</TableCell>
                      <TableCell>{trade.amount.toFixed(4)}</TableCell>
                      <TableCell>${trade.currentPrice?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {trade.profit !== null && (
                          <div className="flex items-center">
                            {trade.profit >= 0 ? (
                              <>
                                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                <span className="text-green-500">
                                  +${trade.profit.toFixed(2)} ({trade.profitPercentage?.toFixed(2)}%)
                                </span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                <span className="text-red-500">
                                  -${Math.abs(trade.profit).toFixed(2)} ({Math.abs(trade.profitPercentage || 0).toFixed(2)}%)
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => closePosition(trade.id)}
                        >
                          Close
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border rounded-md border-dashed text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No open positions. Create a trade to see it here.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Trading Pair</Label>
                  <Select value={symbol} onValueChange={setSymbol}>
                    <SelectTrigger id="symbol">
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair.value} value={pair.value}>
                          {pair.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Current market price: ~${getCurrentPrice(symbol).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Trade Type</Label>
                  <Select value={tradeType} onValueChange={(value: 'buy' | 'sell') => setTradeType(value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    {price && amount ? `Total value: $${(parseFloat(price) * parseFloat(amount)).toFixed(2)}` : 'Enter amount and price to see total'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={clearAllTrades}
                type="button"
                className="text-red-500 border-red-500"
              >
                Reset Account
              </Button>
              <Button 
                onClick={executeTrade} 
                type="button"
                className={tradeType === 'buy' ? 'bg-green-600' : 'bg-red-600'}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {symbol.split('-')[0]}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <PaperTradeHistory closedTrades={closedTrades} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
