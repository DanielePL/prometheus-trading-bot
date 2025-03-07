import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  PlayCircle, 
  StopCircle, 
  RefreshCw,
  Database,
  ScrollText,
  Flame,
  FileText
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PaperTradesPanel } from '@/components/trading/paper-trades';

export const BotStatus = () => {
  const [isRunning, setIsRunning] = React.useState(true);
  const [progress, setProgress] = React.useState(78);
  const [isPaperTrading, setIsPaperTrading] = React.useState(true);
  const [isTraining, setIsTraining] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);
  const [botLogs, setBotLogs] = React.useState<string[]>([]);
  const [showPaperTrades, setShowPaperTrades] = React.useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const change = Math.random() * 5 - 2;
          return Math.max(0, Math.min(100, prev + change));
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);
  
  React.useEffect(() => {
    if (isRunning) {
      const generateRandomLogs = () => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        const logTypes = [
          `[${timestamp}] Market data fetched for BTC-USD. Current price: $${(30000 + Math.random() * 2000).toFixed(2)}`,
          `[${timestamp}] RSI indicator: ${(Math.random() * 100).toFixed(2)}`,
          `[${timestamp}] MACD crossover detected, signal strength: ${(Math.random()).toFixed(2)}`,
          `[${timestamp}] Volume analysis complete. 24h volume: ${(Math.random() * 1000).toFixed(2)}M`,
          `[${timestamp}] Social sentiment analysis: ${Math.random() > 0.5 ? 'Bullish' : 'Bearish'} (${(Math.random()).toFixed(2)} confidence)`,
          `[${timestamp}] Bot health check: OK`,
          `[${timestamp}] Running strategy: Moving Average Crossover`,
          `[${timestamp}] Analyzing support/resistance levels...`
        ];
        
        setBotLogs(prev => {
          const newLogs = [...prev, logTypes[Math.floor(Math.random() * logTypes.length)]];
          return newLogs.slice(-100);
        });
      };
      
      if (botLogs.length === 0) {
        const initialLogs = [
          `[${new Date().toLocaleTimeString()}] Bot started in ${isPaperTrading ? 'PAPER' : 'LIVE'} mode`,
          `[${new Date().toLocaleTimeString()}] Connected to Kraken API successfully`,
          `[${new Date().toLocaleTimeString()}] ML model initialized with 92% accuracy`,
          `[${new Date().toLocaleTimeString()}] Monitoring BTC-USD trading pair`
        ];
        setBotLogs(initialLogs);
      }
      
      const logInterval = setInterval(generateRandomLogs, 5000);
      return () => clearInterval(logInterval);
    }
  }, [isRunning, botLogs.length, isPaperTrading]);
  
  const toggleBot = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "Prometheus Stopped" : "Prometheus Started",
      description: isRunning ? "Trading bot has been stopped" : "Trading bot is now running",
    });
  };
  
  const toggleTradingMode = () => {
    setIsPaperTrading(!isPaperTrading);
    toast({
      title: "Trading Mode Changed",
      description: isPaperTrading ? "Switched to Live Trading" : "Switched to Paper Trading",
      variant: isPaperTrading ? "destructive" : "default",
    });
  };
  
  const trainModel = () => {
    setIsTraining(true);
    toast({
      title: "Model Training Started",
      description: "Training Prometheus ML model with latest data",
    });
    
    setTimeout(() => {
      setIsTraining(false);
      toast({
        title: "Model Training Complete",
        description: "Model has been updated with 74.5% accuracy",
      });
    }, 3000);
  };

  const viewLogs = () => {
    setShowLogs(true);
  };

  const viewHistoricalData = () => {
    toast({
      title: "Historical Data",
      description: "Accessing historical trading data...",
    });
  };

  const viewPaperTrades = () => {
    setShowPaperTrades(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Prometheus Status</CardTitle>
                <CardDescription>Current trading bot status</CardDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={isRunning 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              {isRunning ? "Active" : "Stopped"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Bot Control</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {isRunning ? "Running" : "Stopped"}
                </span>
                <Switch 
                  checked={isRunning} 
                  onCheckedChange={toggleBot} 
                  className={isRunning ? "bg-green-600" : ""} 
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trading Mode</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {isPaperTrading ? "Paper Trading" : "Live Trading"}
                </span>
                <Switch 
                  checked={!isPaperTrading} 
                  onCheckedChange={toggleTradingMode} 
                  className={!isPaperTrading ? "bg-amber-600" : ""} 
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">System Load</span>
                <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                <span>Connected to Kraken API</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                <span>ML model loaded</span>
              </div>
              <div className="flex items-center text-sm">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span>Last signal: BUY (0.73 confidence)</span>
              </div>
              <div className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span>Social sentiment: Neutral</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 pt-2">
              <Button 
                variant="outline" 
                className={isRunning ? "text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" : "text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"}
                onClick={toggleBot}
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
              <Button 
                variant="outline"
                disabled={isTraining}
                onClick={trainModel}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isTraining ? 'animate-spin' : ''}`} />
                {isTraining ? 'Training...' : 'Train Model'}
              </Button>
            </div>
            
            <div className="flex justify-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={viewHistoricalData}>
                <Database className="mr-2 h-4 w-4" />
                Historical Data
              </Button>
              <Button variant="outline" size="sm" onClick={viewLogs}>
                <ScrollText className="mr-2 h-4 w-4" />
                View Logs
              </Button>
              <Button variant="outline" size="sm" onClick={viewPaperTrades}>
                <FileText className="mr-2 h-4 w-4" />
                Paper Trades
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Prometheus Bot Logs</DialogTitle>
            <DialogDescription>
              Real-time trading activity and bot operations
            </DialogDescription>
          </DialogHeader>
          <div className="h-[50vh] overflow-y-auto rounded-md border bg-muted p-4 font-mono text-sm">
            {botLogs.length > 0 ? (
              botLogs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center pt-8">
                No logs available. Start the bot to generate logs.
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowLogs(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaperTrades} onOpenChange={setShowPaperTrades}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paper Trading Simulator</DialogTitle>
            <DialogDescription>
              Practice trading with virtual funds and no risk
            </DialogDescription>
          </DialogHeader>
          <PaperTradesPanel />
        </DialogContent>
      </Dialog>
    </>
  );
};
