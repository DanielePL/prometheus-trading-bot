
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  PlayCircle,
  StopCircle,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  TrendingUp,
  BarChart,
  DollarSign,
  Percent,
  Zap,
  Activity,
  BellRing,
  Volume2,
  Lock,
  Code,
} from 'lucide-react';

export const TradingBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tradeMode, setTradeMode] = useState<'paper' | 'live'>('paper');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [tradingStrategy, setTradingStrategy] = useState('macrossover');
  const [maxTradingAmount, setMaxTradingAmount] = useState('1000');
  const [tradingPair, setTradingPair] = useState('BTC-USD');
  const [logs, setLogs] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [lastTrade, setLastTrade] = useState<null | { type: 'buy' | 'sell', price: string, amount: string, timestamp: string }>(null);
  const { toast } = useToast();

  // Mock trading pairs
  const tradingPairs = [
    { value: 'BTC-USD', label: 'Bitcoin/USD' },
    { value: 'ETH-USD', label: 'Ethereum/USD' },
    { value: 'SOL-USD', label: 'Solana/USD' },
    { value: 'DOGE-USD', label: 'Dogecoin/USD' },
    { value: 'ADA-USD', label: 'Cardano/USD' },
  ];

  // Mock trading strategies
  const tradingStrategies = [
    { value: 'macrossover', label: 'Moving Average Crossover' },
    { value: 'rsioscillator', label: 'RSI Oscillator' },
    { value: 'bollingerbands', label: 'Bollinger Bands' },
    { value: 'volumeprofile', label: 'Volume Profile' },
    { value: 'supportresistance', label: 'Support & Resistance' },
  ];

  // Simulate logs and resource usage when bot is running
  useEffect(() => {
    if (!isRunning) return;

    // Initial log when bot starts
    addLog('Bot started. Initializing trading algorithms...');
    
    const logInterval = setInterval(() => {
      const randomLogMessages = [
        'Analyzing market data for trading opportunities...',
        'Processing technical indicators for BTC-USD...',
        'Checking order book depth on exchange...',
        'Running price prediction algorithms...',
        'Calculating optimal entry points based on current volatility...',
        `Monitoring ${tradingPair} price movements...`,
        'Fetching latest candle data from exchange API...',
        'Performing sentiment analysis on market news...',
        'Evaluating trade performance metrics...',
        `Current risk level: ${riskLevel.toUpperCase()}`,
      ];
      
      const randomLog = randomLogMessages[Math.floor(Math.random() * randomLogMessages.length)];
      addLog(randomLog);
      
      // Randomly generate a trade
      if (Math.random() > 0.85) {
        generateTrade();
      }
      
    }, 5000);
    
    // Simulate resource usage
    const resourceInterval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 40) + 20);
      setMemoryUsage(Math.floor(Math.random() * 30) + 40);
      setExecutionTime(prev => prev + 3);
    }, 3000);
    
    return () => {
      clearInterval(logInterval);
      clearInterval(resourceInterval);
      
      // Reset resource usage when stopped
      if (!isRunning) {
        setCpuUsage(0);
        setMemoryUsage(0);
        setExecutionTime(0);
        addLog('Bot stopped. Trading algorithms terminated.');
      }
    };
  }, [isRunning, tradingPair, riskLevel]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  const generateTrade = () => {
    const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = tradeType === 'buy' 
      ? (Math.floor(Math.random() * 1000) + 40000).toFixed(2)
      : (Math.floor(Math.random() * 1000) + 39500).toFixed(2);
    
    const amount = (Math.random() * 0.1).toFixed(5);
    const timestamp = new Date().toISOString();
    
    setLastTrade({
      type: tradeType,
      price,
      amount,
      timestamp
    });
    
    addLog(`${tradeType.toUpperCase()} order executed: ${amount} BTC at $${price}`);
    
    toast({
      title: `${tradeType === 'buy' ? 'Buy' : 'Sell'} Order Executed`,
      description: `${amount} BTC at $${price}`,
      variant: tradeType === 'buy' ? 'default' : 'destructive'
    });
  };

  const startBot = () => {
    setIsRunning(true);
    toast({
      title: 'Trading Bot Started',
      description: `Bot is now running in ${tradeMode} trading mode.`,
    });
  };

  const stopBot = () => {
    setIsRunning(false);
    toast({
      title: 'Trading Bot Stopped',
      description: 'Bot has been stopped successfully.',
    });
  };

  const toggleTradingMode = (mode: 'paper' | 'live') => {
    if (mode === 'live') {
      const confirm = window.confirm(
        'WARNING: You are switching to LIVE trading mode. Real funds will be used for trades. Are you sure you want to continue?'
      );
      if (!confirm) return;
    }
    
    setTradeMode(mode);
    toast({
      title: 'Trading Mode Changed',
      description: `Switched to ${mode === 'paper' ? 'Paper' : 'Live'} Trading`,
      variant: mode === 'live' ? 'destructive' : 'default',
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Trading Bot</CardTitle>
                <CardDescription>Configure and control your trading bot</CardDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={isRunning 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              {isRunning ? 'Running' : 'Stopped'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trading Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Trading Mode</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant={tradeMode === 'paper' ? 'default' : 'outline'} 
                  onClick={() => toggleTradingMode('paper')}
                >
                  Paper Trading
                </Button>
                <Button 
                  size="sm" 
                  variant={tradeMode === 'live' ? 'destructive' : 'outline'} 
                  onClick={() => toggleTradingMode('live')}
                >
                  Live Trading
                </Button>
              </div>
            </div>
            {tradeMode === 'live' && (
              <div className="flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Live trading mode uses real funds. Trade with caution.</span>
              </div>
            )}
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Bot Configuration
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tradingPair">Trading Pair</Label>
                <Select value={tradingPair} onValueChange={setTradingPair}>
                  <SelectTrigger id="tradingPair">
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
                <Label htmlFor="tradingStrategy">Strategy</Label>
                <Select value={tradingStrategy} onValueChange={setTradingStrategy}>
                  <SelectTrigger id="tradingStrategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradingStrategies.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={riskLevel} onValueChange={(val: any) => setRiskLevel(val)}>
                  <SelectTrigger id="riskLevel">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxTradingAmount">Max Trading Amount ($)</Label>
                <Input 
                  id="maxTradingAmount" 
                  type="number" 
                  value={maxTradingAmount} 
                  onChange={(e) => setMaxTradingAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Bot Status
            </h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{cpuUsage}%</span>
                </div>
                <Progress value={cpuUsage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Memory</span>
                  <span>{memoryUsage}%</span>
                </div>
                <Progress value={memoryUsage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Runtime</span>
                  <span>{Math.floor(executionTime / 60)}m {executionTime % 60}s</span>
                </div>
                <Progress value={(executionTime % 300) / 3} className="h-2" />
              </div>
            </div>
          </div>
          
          {/* Last Trade */}
          {lastTrade && (
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Trade
              </h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm text-muted-foreground">Type:</div>
                <div className={`text-sm font-medium ${lastTrade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {lastTrade.type.toUpperCase()}
                </div>
                
                <div className="text-sm text-muted-foreground">Amount:</div>
                <div className="text-sm font-medium">{lastTrade.amount} BTC</div>
                
                <div className="text-sm text-muted-foreground">Price:</div>
                <div className="text-sm font-medium">${lastTrade.price}</div>
                
                <div className="text-sm text-muted-foreground">Time:</div>
                <div className="text-sm font-medium">
                  {new Date(lastTrade.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/30 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <Switch 
                id="bot-active" 
                checked={isRunning} 
                onCheckedChange={(checked) => checked ? startBot() : stopBot()}
              />
              <Label htmlFor="bot-active">
                {isRunning ? 'Active' : 'Inactive'}
              </Label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLogs([]);
                  toast({ title: "Logs Cleared" });
                }}
              >
                Clear Logs
              </Button>
              <Button
                variant={isRunning ? "destructive" : "default"}
                size="sm"
                onClick={() => isRunning ? stopBot() : startBot()}
              >
                {isRunning ? (
                  <>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Bot
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Bot
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Bot Logs */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Bot Logs</CardTitle>
              <CardDescription>Real-time trading activity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[425px] rounded-md border bg-muted p-4 font-mono text-sm overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center pt-8">
                Bot is idle. Start the bot to see logs.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
              {isRunning ? 'Bot is running' : 'Bot is stopped'}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (!isRunning) return;
                addLog('Executing manual market data refresh...');
                setTimeout(() => {
                  addLog('Market data updated successfully');
                }, 1500);
                toast({
                  title: "Manual Refresh",
                  description: "Market data refresh initiated"
                });
              }}
              disabled={!isRunning}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
