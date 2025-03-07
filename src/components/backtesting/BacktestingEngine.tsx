
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Input
} from '@/components/ui/input';
import {
  Label
} from '@/components/ui/label';
import {
  Button
} from '@/components/ui/button';
import {
  Switch
} from '@/components/ui/switch';
import { 
  BacktestResults 
} from '@/components/backtesting/BacktestResults';
import { 
  BacktestParameters 
} from '@/components/backtesting/BacktestParameters';
import { 
  tradingStrategies 
} from '@/hooks/useTradingBot';
import { 
  PlayCircle, 
  Clock, 
  BarChart4, 
  LineChart 
} from 'lucide-react';
import { 
  useToast 
} from '@/hooks/use-toast';

export const BacktestingEngine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [strategy, setStrategy] = useState("dynamicstoploss");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [initialCapital, setInitialCapital] = useState("10000");
  const [symbol, setSymbol] = useState("BTC-USD");
  const [includeFees, setIncludeFees] = useState(true);
  const [optimizeParameters, setOptimizeParameters] = useState(false);
  const { toast } = useToast();

  const runBacktest = () => {
    setIsLoading(true);
    toast({
      title: "Running Backtest",
      description: "Processing historical data and executing strategy",
    });
    
    // Simulate backtest running
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      toast({
        title: "Backtest Complete",
        description: "Results are ready to view",
      });
    }, 3000);
  };

  const resetBacktest = () => {
    setShowResults(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Backtesting Engine
        </CardTitle>
        <CardDescription>
          Test trading strategies against historical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trading-strategy">Trading Strategy</Label>
                <Select value={strategy} onValueChange={setStrategy}>
                  <SelectTrigger id="trading-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradingStrategies.map((strat) => (
                      <SelectItem key={strat.value} value={strat.value}>
                        {strat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trading-pair">Trading Pair</Label>
                <Select value={symbol} onValueChange={setSymbol}>
                  <SelectTrigger id="trading-pair">
                    <SelectValue placeholder="Select trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC-USD">Bitcoin (BTC-USD)</SelectItem>
                    <SelectItem value="ETH-USD">Ethereum (ETH-USD)</SelectItem>
                    <SelectItem value="SOL-USD">Solana (SOL-USD)</SelectItem>
                    <SelectItem value="DOGE-USD">Dogecoin (DOGE-USD)</SelectItem>
                    <SelectItem value="ADA-USD">Cardano (ADA-USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initial-capital">Initial Capital ($)</Label>
              <Input
                id="initial-capital"
                type="number"
                min="100"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="include-fees" className="cursor-pointer">Include Trading Fees</Label>
              <Switch
                id="include-fees"
                checked={includeFees}
                onCheckedChange={setIncludeFees}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="optimize-params" className="cursor-pointer">Parameter Optimization</Label>
              <Switch
                id="optimize-params"
                checked={optimizeParameters}
                onCheckedChange={setOptimizeParameters}
              />
            </div>
            
            {optimizeParameters && <BacktestParameters strategyType={strategy} />}
            
            <Button 
              className="w-full" 
              onClick={runBacktest}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LineChart className="mr-2 h-4 w-4 animate-spin" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run Backtest
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <BacktestResults
              strategy={tradingStrategies.find(s => s.value === strategy)?.label || strategy}
              symbol={symbol}
              startDate={startDate}
              endDate={endDate}
              initialCapital={initialCapital}
            />
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={resetBacktest}
            >
              <BarChart4 className="mr-2 h-4 w-4" />
              Configure New Backtest
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
