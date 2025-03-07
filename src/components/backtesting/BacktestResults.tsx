
import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from 'lucide-react';

interface BacktestResultsProps {
  strategy: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialCapital: string;
}

export const BacktestResults: React.FC<BacktestResultsProps> = ({
  strategy,
  symbol,
  startDate,
  endDate,
  initialCapital
}) => {
  // Mock backtest results
  const results = {
    finalCapital: "$14,325.67",
    totalProfit: "$4,325.67",
    profitPercentage: 43.26,
    totalTrades: 87,
    winningTrades: 52,
    losingTrades: 35,
    winRate: 59.77,
    profitFactor: 2.31,
    maxDrawdown: 15.43,
    sharpeRatio: 1.73,
    sortinoRatio: 2.18,
    averageWin: "$213.45",
    averageLoss: "$112.78",
    largestWin: "$752.30",
    largestLoss: "$431.18",
    maxConsecutiveWins: 8,
    maxConsecutiveLosses: 4,
    tradesPerMonth: 7.25,
    holdingPeriod: "14.3 hours",
    bestMonth: "March 2023 (+12.3%)",
    worstMonth: "July 2023 (-8.1%)"
  };
  
  // Mock trades for the trade list
  const trades = [
    { id: 1, date: "2023-01-15", type: "BUY", price: "$35,420.50", size: "0.12 BTC", profit: "$241.30 (5.6%)", status: "win" },
    { id: 2, date: "2023-01-21", type: "SELL", price: "$36,120.75", size: "0.12 BTC", profit: "$241.30 (5.6%)", status: "win" },
    { id: 3, date: "2023-02-03", type: "BUY", price: "$37,842.10", size: "0.11 BTC", profit: "-$175.40 (-4.2%)", status: "loss" },
    { id: 4, date: "2023-02-08", type: "SELL", price: "$36,240.20", size: "0.11 BTC", profit: "-$175.40 (-4.2%)", status: "loss" },
    { id: 5, date: "2023-02-20", type: "BUY", price: "$38,950.80", size: "0.10 BTC", profit: "$312.70 (8.1%)", status: "win" },
    { id: 6, date: "2023-03-05", type: "SELL", price: "$42,125.40", size: "0.10 BTC", profit: "$312.70 (8.1%)", status: "win" },
    { id: 7, date: "2023-03-25", type: "BUY", price: "$44,230.60", size: "0.09 BTC", profit: "$198.25 (5.0%)", status: "win" },
    { id: 8, date: "2023-04-01", type: "SELL", price: "$46,420.30", size: "0.09 BTC", profit: "$198.25 (5.0%)", status: "win" }
  ];
  
  // Mock parameters for the optimized parameters
  const optimizedParams = {
    "dynamicstoploss": {
      stopLossPercentage: 2.8,
      trailingStopActivation: 1.7,
      confidenceThreshold: 0.72
    },
    "macrossover": {
      shortPeriod: 8,
      longPeriod: 24,
      signalPeriod: 7
    },
    "rsioscillator": {
      rsiPeriod: 12,
      overbought: 73,
      oversold: 27
    },
    "bollingerbands": {
      period: 22,
      stdDev: 2.2,
      maType: "ema"
    }
  };
  
  const getStrategyParams = () => {
    const strategyKey = strategy.toLowerCase().replace(/\s+/g, '');
    for (const [key, params] of Object.entries(optimizedParams)) {
      if (strategyKey.includes(key)) {
        return params;
      }
    }
    return optimizedParams["dynamicstoploss"];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-md bg-muted flex flex-col">
          <span className="text-sm text-muted-foreground">Total Return</span>
          <span className="text-2xl font-bold text-green-500">+{results.profitPercentage}%</span>
          <span className="text-sm text-muted-foreground mt-1">{results.totalProfit}</span>
        </div>
        
        <div className="p-4 rounded-md bg-muted flex flex-col">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <span className="text-2xl font-bold">{results.winRate}%</span>
          <span className="text-sm text-muted-foreground mt-1">{results.winningTrades}/{results.totalTrades} trades</span>
        </div>
        
        <div className="p-4 rounded-md bg-muted flex flex-col">
          <span className="text-sm text-muted-foreground">Profit Factor</span>
          <span className="text-2xl font-bold">{results.profitFactor}</span>
          <span className="text-sm text-muted-foreground mt-1">Profit/loss ratio</span>
        </div>
        
        <div className="p-4 rounded-md bg-muted flex flex-col">
          <span className="text-sm text-muted-foreground">Max Drawdown</span>
          <span className="text-2xl font-bold text-red-500">{results.maxDrawdown}%</span>
          <span className="text-sm text-muted-foreground mt-1">Largest drop from peak</span>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="trades">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trades
              </TabsTrigger>
              <TabsTrigger value="parameters">
                <PieChart className="h-4 w-4 mr-2" />
                Optimized Parameters
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Backtest Summary</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Backtest of {strategy} strategy on {symbol} from {startDate} to {endDate}
                  with initial capital of ${initialCapital}.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Initial Capital:</span>
                    <span className="float-right">${initialCapital}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Final Capital:</span>
                    <span className="float-right">{results.finalCapital}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Profit:</span>
                    <span className="float-right text-green-500">{results.totalProfit}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Sharpe Ratio:</span>
                    <span className="float-right">{results.sharpeRatio}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Sortino Ratio:</span>
                    <span className="float-right">{results.sortinoRatio}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Average Win:</span>
                    <span className="float-right text-green-500">{results.averageWin}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Average Loss:</span>
                    <span className="float-right text-red-500">{results.averageLoss}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Largest Win:</span>
                    <span className="float-right text-green-500">{results.largestWin}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Largest Loss:</span>
                    <span className="float-right text-red-500">{results.largestLoss}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Consecutive Wins:</span>
                    <span className="float-right">{results.maxConsecutiveWins}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Consecutive Losses:</span>
                    <span className="float-right">{results.maxConsecutiveLosses}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Trades Per Month:</span>
                    <span className="float-right">{results.tradesPerMonth}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Avg. Holding Period:</span>
                    <span className="float-right">{results.holdingPeriod}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Best Month:</span>
                    <span className="float-right text-green-500">{results.bestMonth}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Worst Month:</span>
                    <span className="float-right text-red-500">{results.worstMonth}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Equity curve chart will be displayed here</span>
              </div>
            </TabsContent>
            
            <TabsContent value="trades">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.date}</TableCell>
                        <TableCell>
                          {trade.type === "BUY" ? (
                            <span className="flex items-center text-green-500">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              BUY
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              SELL
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{trade.price}</TableCell>
                        <TableCell>{trade.size}</TableCell>
                        <TableCell className={trade.status === "win" ? "text-green-500" : "text-red-500"}>
                          {trade.profit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="parameters">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Optimized Strategy Parameters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These parameters produced the best results during optimization.
                </p>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {Object.entries(getStrategyParams()).map(([param, value]) => (
                    <div key={param} className="text-sm">
                      <span className="text-muted-foreground">
                        {param.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="float-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-md mt-4 flex items-center justify-center">
                <PieChart className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Parameter optimization chart will be displayed here</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
