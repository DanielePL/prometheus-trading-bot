
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, KeyRound } from 'lucide-react';

interface BotConfigurationProps {
  tradingPair: string;
  tradingStrategy: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradingAmount: string;
  tradingPairs: { value: string, label: string }[];
  tradingStrategies: { value: string, label: string }[];
  onTradingPairChange: (value: string) => void;
  onTradingStrategyChange: (value: string) => void;
  onRiskLevelChange: (value: any) => void;
  onMaxTradingAmountChange: (value: string) => void;
  onConfigureApiKeys: () => void;
}

export const BotConfiguration: React.FC<BotConfigurationProps> = ({
  tradingPair,
  tradingStrategy,
  riskLevel,
  maxTradingAmount,
  tradingPairs,
  tradingStrategies,
  onTradingPairChange,
  onTradingStrategyChange,
  onRiskLevelChange,
  onMaxTradingAmountChange,
  onConfigureApiKeys
}) => {
  return (
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
  );
};
