
import React, { useState } from 'react';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Calculator, 
  ArrowDown, 
  TrendingDown 
} from 'lucide-react';
import { 
  useToast 
} from '@/hooks/use-toast';

export const StopLossCalculator = () => {
  const [strategy, setStrategy] = useState<string>("percentage");
  const [entryPrice, setEntryPrice] = useState<string>("50000");
  const [percentage, setPercentage] = useState<string>("2");
  const [atrValue, setAtrValue] = useState<string>("1250");
  const [atrMultiplier, setAtrMultiplier] = useState<string>("2");
  const [supportLevel, setSupportLevel] = useState<string>("48500");
  const [stopLossPrice, setStopLossPrice] = useState<string>("");
  const [riskAmount, setRiskAmount] = useState<string>("");
  const { toast } = useToast();

  const calculateStopLoss = () => {
    try {
      const entry = parseFloat(entryPrice);
      
      if (isNaN(entry) || entry <= 0) {
        throw new Error("Please enter a valid entry price");
      }
      
      let stopPrice = 0;
      
      switch (strategy) {
        case "percentage":
          const pct = parseFloat(percentage);
          if (isNaN(pct) || pct <= 0) {
            throw new Error("Please enter a valid percentage");
          }
          stopPrice = entry * (1 - pct / 100);
          break;
          
        case "atr":
          const atr = parseFloat(atrValue);
          const multiplier = parseFloat(atrMultiplier);
          if (isNaN(atr) || atr <= 0 || isNaN(multiplier) || multiplier <= 0) {
            throw new Error("Please enter valid ATR values");
          }
          stopPrice = entry - (atr * multiplier);
          break;
          
        case "support":
          const support = parseFloat(supportLevel);
          if (isNaN(support) || support <= 0 || support >= entry) {
            throw new Error("Support level should be below entry price");
          }
          stopPrice = support;
          break;
      }
      
      const risk = entry - stopPrice;
      
      setStopLossPrice(stopPrice.toFixed(2));
      setRiskAmount(risk.toFixed(2));
      
      toast({
        title: "Stop Loss Calculated",
        description: `Stop loss price: $${stopPrice.toFixed(2)}`,
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
        <Label>Stop Loss Strategy</Label>
        <RadioGroup 
          value={strategy} 
          onValueChange={setStrategy}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage" className="cursor-pointer">Percentage-based</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="atr" id="atr" />
            <Label htmlFor="atr" className="cursor-pointer">ATR-based</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="support" id="support" />
            <Label htmlFor="support" className="cursor-pointer">Support Level</Label>
          </div>
        </RadioGroup>
      </div>
      
      {strategy === "percentage" && (
        <div className="space-y-2">
          <Label htmlFor="percentage-value">Percentage Below Entry (%)</Label>
          <Input
            id="percentage-value"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            type="number"
            min="0.1"
            step="0.1"
          />
        </div>
      )}
      
      {strategy === "atr" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="atr-value">ATR Value</Label>
            <Input
              id="atr-value"
              value={atrValue}
              onChange={(e) => setAtrValue(e.target.value)}
              type="number"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="atr-multiplier">ATR Multiplier</Label>
            <Input
              id="atr-multiplier"
              value={atrMultiplier}
              onChange={(e) => setAtrMultiplier(e.target.value)}
              type="number"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
      )}
      
      {strategy === "support" && (
        <div className="space-y-2">
          <Label htmlFor="support-level">Support Level ($)</Label>
          <Input
            id="support-level"
            value={supportLevel}
            onChange={(e) => setSupportLevel(e.target.value)}
            type="number"
            min="0"
          />
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={calculateStopLoss}
      >
        <Calculator className="mr-2 h-4 w-4" />
        Calculate Stop Loss
      </Button>
      
      {stopLossPrice && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-md bg-muted">
            <div className="text-sm text-muted-foreground">Stop Loss Price</div>
            <div className="text-xl font-bold flex items-center">
              ${stopLossPrice}
              <TrendingDown className="ml-2 h-4 w-4 text-red-500" />
            </div>
          </div>
          
          <div className="p-4 rounded-md bg-muted">
            <div className="text-sm text-muted-foreground">Risk Amount</div>
            <div className="text-xl font-bold flex items-center">
              ${riskAmount}
              <ArrowDown className="ml-2 h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
