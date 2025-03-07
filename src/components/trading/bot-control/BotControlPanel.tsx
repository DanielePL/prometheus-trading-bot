
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { TradingModeSelector } from './TradingModeSelector';
import { BotConfiguration } from './BotConfiguration';
import { StatusIndicators } from './StatusIndicators';
import { LastTradeInfo } from './LastTradeInfo';
import { BotControls } from './BotControls';

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

export const BotControlPanel: React.FC<BotControlPanelProps> = (props) => {
  const {
    isRunning,
    tradeMode,
    lastTrade,
    hasApiKeys,
    onToggleTradingMode,
    onConfigureApiKeys
  } = props;

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
        <TradingModeSelector 
          tradeMode={tradeMode} 
          onToggleTradingMode={onToggleTradingMode} 
          hasApiKeys={hasApiKeys}
          onConfigureApiKeys={onConfigureApiKeys}
        />
        
        <BotConfiguration {...props} />
        
        <StatusIndicators 
          cpuUsage={props.cpuUsage} 
          memoryUsage={props.memoryUsage} 
          executionTime={props.executionTime} 
        />
        
        {lastTrade && <LastTradeInfo lastTrade={lastTrade} />}
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-6 py-4">
        <BotControls 
          isRunning={isRunning}
          onStartBot={props.onStartBot}
          onStopBot={props.onStopBot}
          onClearLogs={props.onClearLogs}
        />
      </CardFooter>
    </Card>
  );
};
