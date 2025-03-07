
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, KeyRound } from 'lucide-react';

interface TradingModeSelectorProps {
  tradeMode: 'paper' | 'live';
  onToggleTradingMode: (mode: 'paper' | 'live') => void;
  hasApiKeys: boolean;
  onConfigureApiKeys: () => void;
}

export const TradingModeSelector: React.FC<TradingModeSelectorProps> = ({ 
  tradeMode, 
  onToggleTradingMode,
  hasApiKeys,
  onConfigureApiKeys
}) => {
  return (
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
      
      {!hasApiKeys && (
        <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
          <span className="text-sm">API keys required for market data access</span>
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
  );
};
