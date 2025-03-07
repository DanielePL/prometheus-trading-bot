
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const PaperTradesPanel: React.FC = () => {
  const [trades, setTrades] = useState<PaperTrade[]>(() => {
    const savedTrades = localStorage.getItem('paperTrades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  
  const [symbol, setSymbol] = useState('BTC-USD');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  
  const { toast } = useToast();
  
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
  };
  
  // Initialize and update prices periodically
  React.useEffect(() => {
    // Initial update
    updatePrices();
    
    // Set up interval for updates
    const interval = setInterval(updatePrices, 10000);
    
    return () => clearInterval(interval);
  }, [trades.length]);
  
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
    
    const currentPrice = getCurrentPrice(symbol);
    const newTrade: PaperTrade = {
      id: Date.now().toString(),
      symbol,
      type: tradeType,
      price: priceValue,
      amount: amountValue,
      total: priceValue * amountValue,
      currentPrice,
      profit: 0,
      profitPercentage: 0,
      timestamp: Date.now()
    };
    
    const updatedTrades = [...trades, newTrade];
    setTrades(updatedTrades);
    localStorage.setItem('paperTrades', JSON.stringify(updatedTrades));
    
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
    if (trade.type === 'buy') {
      profit = (currentPrice - trade.price) * trade.amount;
    } else {
      profit = (trade.price - currentPrice) * trade.amount;
    }
    
    toast({
      title: "Position Closed",
      description: `Realized P&L: ${profit > 0 ? '+' : ''}$${profit.toFixed(2)}`,
      variant: profit >= 0 ? "default" : "destructive"
    });
    
    const updatedTrades = trades.filter(t => t.id !== id);
    setTrades(updatedTrades);
    localStorage.setItem('paperTrades', JSON.stringify(updatedTrades));
  };
  
  const clearAllTrades = () => {
    if (window.confirm('Are you sure you want to clear all paper trades?')) {
      setTrades([]);
      localStorage.removeItem('paperTrades');
      toast({
        title: "All Trades Cleared",
        description: "Your paper trading history has been reset",
      });
    }
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
        <CardTitle>Paper Trading</CardTitle>
        <CardDescription>Simulate trades without using real funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
        
        <div className="pt-2 flex justify-between">
          <Button 
            variant="outline" 
            onClick={clearAllTrades}
            type="button"
          >
            Clear All Trades
          </Button>
          <Button onClick={executeTrade} type="button">
            Execute Paper Trade
          </Button>
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Open Positions</h3>
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
              <p className="text-sm text-muted-foreground">No paper trades yet. Create a trade to see it here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
