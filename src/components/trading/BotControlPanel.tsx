import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  StopCircle, 
  Settings, 
  AlertCircle, 
  Clock, 
  Zap, 
  Activity,
  KeyRound
} from 'lucide-react';

interface BotControlPanelProps {
  isRunning: boolean;
  tradeMode: 'paper' | 'live';
  riskLevel: 'low' | 'medium' | 'high';
  tradingStrategy: string;
  maxTradingAmount: string;
  tradingPair: string;
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number;
  lastTrade: null | { 
    type: 'buy' | 'sell', 
    price: string, 
    amount: string, 
    timestamp: string 
  };
  tradingPairs: { value: string, label: string }[];
  tradingStrategies: { value: string, label: string }[];
  hasApiKeys: boolean;
  onStartBot: () => void;
  onStopBot: () => void;
  onClearLogs: () => void;
  onToggleTradingMode: (mode: 'paper' | 'live') => void;
  onTradingPairChange: (value: string) => void;
  onTradingStrategyChange: (value: string) => void;
  onRiskLevelChange: (value: any) => void;
  onMaxTradingAmountChange: (value: string) => void;
  onConfigureApiKeys: () => void;
}

export const BotControlPanel: React.FC<BotControlPanelProps> = ({
  isRunning,
  tradeMode,
  riskLevel,
  tradingStrategy,
  maxTradingAmount,
  tradingPair,
  cpuUsage,
  memoryUsage,
  executionTime,
  lastTrade,
  tradingPairs,
  tradingStrategies,
  hasApiKeys,
  onStartBot,
  onStopBot,
  onClearLogs,
  onToggleTradingMode,
  onTradingPairChange,
  onTradingStrategyChange,
  onRiskLevelChange,
  onMaxTradingAmountChange,
  onConfigureApiKeys
}) => {
  return (
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
                onClick={() => onToggleTradingMode('paper')}
              >
                Paper Trading
              </Button>
              <Button 
                size="sm" 
                variant={tradeMode === 'live' ? 'destructive' : 'outline'} 
                onClick={() => onToggleTradingMode('live')}
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
          
          {tradeMode === 'live' && !hasApiKeys && (
            <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
              <span className="text-sm">Exchange API keys required for live trading</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onConfigureApiKeys}
                type="button"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          )}
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Bot Configuration
            </h3>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onConfigureApiKeys}
              className="h-8"
              type="button"
            >
              <KeyRound className="mr-2 h-3 w-3" />
              API Keys
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Select value={tradingPair} onValueChange={onTradingPairChange}>
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
              <Select value={tradingStrategy} onValueChange={onTradingStrategyChange}>
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
              <Select value={riskLevel} onValueChange={onRiskLevelChange}>
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
                onChange={(e) => onMaxTradingAmountChange(e.target.value)}
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
              onCheckedChange={(checked) => checked ? onStartBot() : onStopBot()}
            />
            <Label htmlFor="bot-active">
              {isRunning ? 'Active' : 'Inactive'}
            </Label>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearLogs}
              type="button"
            >
              Clear Logs
            </Button>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={() => isRunning ? onStopBot() : onStartBot()}
              type="button"
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
  );
};
