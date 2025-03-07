
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTradingBot, tradingPairs } from '@/hooks/useTradingBot';
import { RiskManager } from './risk-management/RiskManager';
import { MarketSentiment } from './sentiment/MarketSentiment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Sparkles,
  Shield,
  Gauge,
  LineChart,
  Brain,
  AlertTriangle,
} from 'lucide-react';

export const TradingSystem = () => {
  const [state, actions] = useTradingBot();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Manager */}
        <div className="col-span-1">
          <RiskManager
            tradingPair={state.tradingPair}
            tradeMode={state.tradeMode}
            portfolioValue={10000}
            isRunning={state.isRunning}
          />
        </div>
        
        {/* Market Sentiment */}
        <div className="col-span-1">
          <MarketSentiment tradingPair={state.tradingPair} />
        </div>
        
        {/* Trading Signals */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-base">Trading Signals</CardTitle>
                <CardDescription>Current {state.tradingPair} signals</CardDescription>
              </div>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Technical Indicators */}
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium flex items-center">
                      <LineChart className="h-4 w-4 mr-1.5" />
                      Technical
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Buy
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RSI (14)</span>
                      <span>62.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MACD</span>
                      <span className="text-green-500">Bullish</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MA (50/200)</span>
                      <span className="text-green-500">Above</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BB Width</span>
                      <span>5.2%</span>
                    </div>
                  </div>
                </div>
                
                {/* AI Analysis */}
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium flex items-center">
                      <Brain className="h-4 w-4 mr-1.5" />
                      AI Analysis
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Buy
                    </Badge>
                  </div>
                  
                  <div className="text-xs">
                    <p className="mb-2">Pattern recognition indicates potential breakout with 76% confidence. Support levels stable at recent lows.</p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span>76%</span>
                    </div>
                  </div>
                </div>
                
                {/* Risk Assessment */}
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-1.5" />
                      Risk Assessment
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      Medium
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stop Loss</span>
                      <span>-3.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Cap Risk</span>
                      <span>4.2%</span>
                    </div>
                  </div>
                </div>
                
                {/* Sentiment */}
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium flex items-center">
                      <Gauge className="h-4 w-4 mr-1.5" />
                      Sentiment
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Bullish
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social</span>
                      <span>67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">News</span>
                      <span>72%</span>
                    </div>
                  </div>
                </div>
                
                {/* Warning/Alert */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <div className="text-xs text-amber-800 dark:text-amber-400">
                      <span className="font-medium">Important event approaching:</span> FOMC meeting in 2 days may impact market volatility.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Strategy Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Advanced Strategy Center</CardTitle>
                <CardDescription>Configure and monitor your trading strategies</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <BarChart className="h-4 w-4" />
                Back Test
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
                <TabsTrigger value="dashboard">Strategy Dashboard</TabsTrigger>
                <TabsTrigger value="optimizer">Strategy Optimizer</TabsTrigger>
                <TabsTrigger value="backtesting">Backtest Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-4">
                <div className="text-sm text-muted-foreground text-center py-12">
                  Advanced strategy dashboard will be implemented in the next update.
                </div>
              </TabsContent>
              
              <TabsContent value="optimizer" className="space-y-4">
                <div className="text-sm text-muted-foreground text-center py-12">
                  Strategy optimizer will be implemented in the next update.
                </div>
              </TabsContent>
              
              <TabsContent value="backtesting" className="space-y-4">
                <div className="text-sm text-muted-foreground text-center py-12">
                  Backtest results will be displayed here after running backtests.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
