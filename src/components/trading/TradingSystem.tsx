
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp,
  BarChart2,
  Cpu,
  Database,
  Layers,
  BrainCircuit,
  BarChart,
  Shield,
  Zap,
  LineChart,
  Network
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const TradingSystem = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Advanced Trading System</CardTitle>
              <CardDescription>Enterprise-grade trading infrastructure</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Production Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4">
            <TabsTrigger value="analytics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="forecasting">
              <LineChart className="h-4 w-4 mr-2" />
              Forecasting
            </TabsTrigger>
            <TabsTrigger value="risk">
              <Shield className="h-4 w-4 mr-2" />
              Risk Management
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Cpu className="h-4 w-4 mr-2" />
              Architecture
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Multi-factor Analysis</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border p-2 text-sm">
                    <div className="font-medium">Price Patterns</div>
                    <div className="text-xs text-muted-foreground mt-1">Multi-timeframe</div>
                    <Badge className="mt-2" variant="secondary">Active</Badge>
                  </div>
                  <div className="rounded-md border p-2 text-sm">
                    <div className="font-medium">Order Flow</div>
                    <div className="text-xs text-muted-foreground mt-1">Institutional tracking</div>
                    <Badge className="mt-2" variant="secondary">Active</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Market Sentiment</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border p-2 text-sm">
                    <div className="font-medium">News NLP</div>
                    <div className="text-xs text-muted-foreground mt-1">Financial reports</div>
                    <Badge className="mt-2" variant="outline">87%</Badge>
                  </div>
                  <div className="rounded-md border p-2 text-sm">
                    <div className="font-medium">Social Signals</div>
                    <div className="text-xs text-muted-foreground mt-1">Sentiment extraction</div>
                    <Badge className="mt-2" variant="outline">92%</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Data Integration</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Multi-exchange Data</span>
                    <span className="text-xs font-medium">12 sources</span>
                  </div>
                  <Progress value={92} className="h-1" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Alternative Data</span>
                    <span className="text-xs font-medium">8 sources</span>
                  </div>
                  <Progress value={78} className="h-1" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">On-chain Analytics</span>
                    <span className="text-xs font-medium">4 sources</span>
                  </div>
                  <Progress value={65} className="h-1" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pattern Recognition</h3>
                <div className="rounded-md border p-2 text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-xs">Double Bottom</div>
                    <Badge variant="outline" className="text-xs">Detected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-xs">Liquidity Voids</div>
                    <Badge variant="outline" className="text-xs">3 levels</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-xs">Volume Divergence</div>
                    <Badge variant="outline" className="text-xs">Negative</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecasting" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">ML Models Status</h3>
                <div className="space-y-2">
                  <div className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">LSTM Network</div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Accuracy: 73.5%</div>
                    <div className="text-xs text-muted-foreground">Last trained: Today</div>
                  </div>
                  
                  <div className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Transformer</div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Accuracy: 68.2%</div>
                    <div className="text-xs text-muted-foreground">Last trained: Yesterday</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Probabilistic Forecasts</h3>
                <div className="rounded-md border p-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Bullish Probability</div>
                    <div className="font-bold">67.8%</div>
                  </div>
                  <Progress value={67.8} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="font-medium">Predicted Volatility</div>
                    <div className="font-bold">3.2%</div>
                  </div>
                  <Progress value={32} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="font-medium">Regime Status</div>
                    <Badge>Mean Reverting</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Ensemble Model Predictions</h3>
              <div className="rounded-md border p-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">24h Forecast</div>
                    <div className="text-xl font-bold text-green-600">+2.3%</div>
                    <div className="text-xs text-muted-foreground">Confidence: High</div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">7d Forecast</div>
                    <div className="text-xl font-bold text-green-600">+4.7%</div>
                    <div className="text-xs text-muted-foreground">Confidence: Medium</div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">30d Forecast</div>
                    <div className="text-xl font-bold text-amber-600">+1.2%</div>
                    <div className="text-xs text-muted-foreground">Confidence: Low</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Position Sizing</h3>
                <div className="rounded-md border p-2">
                  <div className="text-sm">
                    <div className="font-medium">Kelly Fraction</div>
                    <div className="text-xl font-bold">0.38</div>
                    <div className="text-xs text-muted-foreground mt-1">Conservative adjustment: 0.5x</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Value at Risk</h3>
                <div className="rounded-md border p-2">
                  <div className="text-sm">
                    <div className="font-medium">Daily VaR (95%)</div>
                    <div className="text-xl font-bold">2.4%</div>
                    <div className="text-xs text-muted-foreground mt-1">Monte Carlo: 10,000 sims</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Drawdown Control</h3>
                <div className="rounded-md border p-2">
                  <div className="text-sm">
                    <div className="font-medium">Max Drawdown</div>
                    <div className="text-xl font-bold">14.2%</div>
                    <div className="text-xs text-muted-foreground mt-1">Circuit breaker: 20%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Stop Loss Mechanics</h3>
              <div className="rounded-md border p-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Volatility-adjusted SL</div>
                    <div className="text-xs text-muted-foreground">Current ATR: 342</div>
                    <div className="text-xs text-muted-foreground">SL Distance: 2.3 × ATR</div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Correlation Protection</div>
                    <div className="text-xs text-muted-foreground">Asset pairs monitored: 12</div>
                    <div className="text-xs text-muted-foreground">Cross-market alarms: 3</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Risk Alerts</h3>
              <div className="rounded-md border p-2 space-y-2">
                <div className="flex items-center text-amber-600 text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>Increased volatility detected in Asian markets</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>All position sizes within prescribed limits</span>
                </div>
                <div className="flex items-center text-red-600 text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>Correlation spike between BTC and tech stocks</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Infrastructure Status</h3>
                <div className="space-y-2">
                  <div className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">DigitalOcean Cluster</div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Online</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">CPU: 28% | RAM: 42% | SSD: 36%</div>
                    <div className="text-xs text-muted-foreground">Nodes: 4 | Containers: 12</div>
                  </div>
                  
                  <div className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Exchange Connectivity</div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Connected</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">APIs: 6 | Websockets: 8</div>
                    <div className="text-xs text-muted-foreground">Latency: 26ms</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">System Performance</h3>
                <div className="rounded-md border p-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Processing Latency</div>
                    <div className="font-bold">18.3ms</div>
                  </div>
                  <Progress value={18.3} max={100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="font-medium">Order Execution</div>
                    <div className="font-bold">42.6ms</div>
                  </div>
                  <Progress value={42.6} max={100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="font-medium">Model Inference</div>
                    <div className="font-bold">156ms</div>
                  </div>
                  <Progress value={62.4} max={100} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Execution Algorithms</h3>
              <div className="rounded-md border p-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-md bg-muted p-2 text-xs">
                    <div className="font-medium">TWAP</div>
                    <Badge className="mt-1" variant="outline">Active</Badge>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-xs">
                    <div className="font-medium">VWAP</div>
                    <Badge className="mt-1" variant="outline">Active</Badge>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-xs">
                    <div className="font-medium">Iceberg</div>
                    <Badge className="mt-1" variant="outline">Active</Badge>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-xs">
                    <div className="font-medium">Smart Router</div>
                    <Badge className="mt-1" variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Self-Learning Status</h3>
              <div className="rounded-md border p-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Reinforcement Learning</div>
                    <div className="text-xs text-muted-foreground">Episodes: 1,342</div>
                    <div className="text-xs text-muted-foreground">Policy updates: 86</div>
                    <div className="text-xs text-muted-foreground">Reward improvement: +18%</div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Adaptive Features</div>
                    <div className="text-xs text-muted-foreground">Auto-features: 28</div>
                    <div className="text-xs text-muted-foreground">Hyperparameters tuned: 14</div>
                    <div className="text-xs text-muted-foreground">Last backtest: 2h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
