
import React, { useState, useEffect } from 'react';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Calculator 
} from 'lucide-react';
import { 
  useToast 
} from '@/hooks/use-toast';

export const PositionSizer = () => {
  const [accountSize, setAccountSize] = useState<string>("10000");
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<string>("50000");
  const [stopLossPrice, setStopLossPrice] = useState<string>("48500");
  const [positionSize, setPositionSize] = useState<string>("0");
  const [contractsToTrade, setContractsToTrade] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("BTC-USD");
  const { toast } = useToast();

  const calculatePosition = () => {
    try {
      const accountValue = parseFloat(accountSize);
      const riskAmount = accountValue * (riskPercentage / 100);
      const entry = parseFloat(entryPrice);
      const stopLoss = parseFloat(stopLossPrice);
      
      if (isNaN(accountValue) || isNaN(entry) || isNaN(stopLoss)) {
        throw new Error("Please enter valid numbers for all fields");
      }
      
      if (entry === stopLoss) {
        throw new Error("Entry and stop loss prices cannot be the same");
      }
      
      const riskPerShare = Math.abs(entry - stopLoss);
      const shares = riskAmount / riskPerShare;
      const posValue = shares * entry;
      
      setPositionSize(posValue.toFixed(2));
      setContractsToTrade(shares.toFixed(4));
      
      toast({
        title: "Position Size Calculated",
        description: `Position value: $${posValue.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "Invalid inputs",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account-size">Account Size ($)</Label>
          <Input
            id="account-size"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            type="number"
            min="0"
          />
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
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="risk-percentage">Risk Per Trade (%)</Label>
          <span className="text-sm text-muted-foreground">{riskPercentage}%</span>
        </div>
        <Slider
          id="risk-percentage"
          min={0.1}
          max={5}
          step={0.1}
          value={[riskPercentage]}
          onValueChange={(value) => setRiskPercentage(value[0])}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry-price">Entry Price ($)</Label>
          <Input
            id="entry-price"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            type="number"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stop-loss">Stop Loss Price ($)</Label>
          <Input
            id="stop-loss"
            value={stopLossPrice}
            onChange={(e) => setStopLossPrice(e.target.value)}
            type="number"
            min="0"
          />
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={calculatePosition}
      >
        <Calculator className="mr-2 h-4 w-4" />
        Calculate Position Size
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-md bg-muted">
          <div className="text-sm text-muted-foreground">Position Value</div>
          <div className="text-xl font-bold">${positionSize}</div>
        </div>
        
        <div className="p-4 rounded-md bg-muted">
          <div className="text-sm text-muted-foreground">Units to Trade</div>
          <div className="text-xl font-bold">{contractsToTrade} {symbol.split('-')[0]}</div>
        </div>
      </div>
    </div>
  );
};
