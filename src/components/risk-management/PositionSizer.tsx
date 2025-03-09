
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Calculator,
  CheckCircle2,
  Scale,
  Dices,
  TrendingUp
} from 'lucide-react';
import { 
  useToast 
} from '@/hooks/use-toast';
import {
  Switch
} from '@/components/ui/switch';

export const PositionSizer = () => {
  const [accountSize, setAccountSize] = useState<string>("10000");
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<string>("50000");
  const [stopLossPrice, setStopLossPrice] = useState<string>("48500");
  const [positionSize, setPositionSize] = useState<string>("0");
  const [contractsToTrade, setContractsToTrade] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("BTC-USD");
  const [applyToAllCoins, setApplyToAllCoins] = useState<boolean>(false);
  const [winRate, setWinRate] = useState<number>(55);
  const [winLossRatio, setWinLossRatio] = useState<number>(1.5);
  const [kellySize, setKellySize] = useState<string>("0");
  const [kellyPercentage, setKellyPercentage] = useState<string>("0");
  const [volatilityAdjustment, setVolatilityAdjustment] = useState<boolean>(true);
  const [volatilityFactor, setVolatilityFactor] = useState<number>(60);
  const [activeTab, setActiveTab] = useState("basic");
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
      
      // Apply volatility adjustment if enabled
      let adjustedShares = shares;
      let adjustedPosValue = posValue;
      
      if (volatilityAdjustment) {
        // Simulate volatility calculation (in a real app, this would use actual market data)
        // Higher volatility = lower position size
        const volatilityMultiplier = volatilityFactor / 100;
        adjustedShares = shares * volatilityMultiplier;
        adjustedPosValue = adjustedShares * entry;
      }
      
      setPositionSize(adjustedPosValue.toFixed(2));
      setContractsToTrade(adjustedShares.toFixed(4));
      
      toast({
        title: applyToAllCoins ? "Position Size Applied to All Coins" : "Position Size Calculated",
        description: applyToAllCoins 
          ? `Risk parameters will be applied to all monitored coins` 
          : `Position value: $${adjustedPosValue.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "Invalid inputs",
        variant: "destructive"
      });
    }
  };
  
  const calculateKellyPosition = () => {
    try {
      // Kelly Criterion formula: f* = (bp - q) / b
      // where:
      // f* = fraction of the bankroll to wager
      // b = the net odds received on the wager (payout-to-1)
      // p = probability of winning
      // q = probability of losing (1 - p)
      
      const p = winRate / 100;
      const q = 1 - p;
      const b = winLossRatio;
      
      const kellyFraction = (b * p - q) / b;
      
      // Apply a safety factor (often Kelly/2 is used to be more conservative)
      const safeKellyFraction = Math.max(0, kellyFraction * 0.5);
      
      // Calculate position size based on Kelly Criterion
      const accountValue = parseFloat(accountSize);
      const kellyPositionSize = accountValue * safeKellyFraction;
      
      setKellySize(kellyPositionSize.toFixed(2));
      setKellyPercentage((safeKellyFraction * 100).toFixed(2));
      
      toast({
        title: "Kelly Position Size Calculated",
        description: `Optimal position size: $${kellyPositionSize.toFixed(2)} (${(safeKellyFraction * 100).toFixed(2)}%)`,
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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">
            <Scale className="h-4 w-4 mr-2" />
            Basic Sizing
          </TabsTrigger>
          <TabsTrigger value="kelly">
            <Dices className="h-4 w-4 mr-2" />
            Kelly Criterion
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
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
              <Label htmlFor="trading-pair" className="flex justify-between">
                <span>Trading Pair</span>
                <span className={applyToAllCoins ? "text-muted-foreground text-sm" : ""}>
                  {applyToAllCoins ? "(Using all monitored coins)" : ""}
                </span>
              </Label>
              <Select 
                value={symbol} 
                onValueChange={setSymbol}
                disabled={applyToAllCoins}
              >
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
          
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="apply-all-coins" className="cursor-pointer">Apply to All Monitored Coins</Label>
            <Switch
              id="apply-all-coins"
              checked={applyToAllCoins}
              onCheckedChange={setApplyToAllCoins}
            />
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
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="volatility-adjustment" className="cursor-pointer">Volatility-Adjusted Sizing</Label>
              <p className="text-xs text-muted-foreground">Reduce position size in high volatility</p>
            </div>
            <Switch
              id="volatility-adjustment"
              checked={volatilityAdjustment}
              onCheckedChange={setVolatilityAdjustment}
            />
          </div>
          
          {volatilityAdjustment && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volatility-factor">Volatility Factor</Label>
                <span className="text-sm text-muted-foreground">{volatilityFactor}%</span>
              </div>
              <Slider
                id="volatility-factor"
                min={20}
                max={100}
                step={5}
                value={[volatilityFactor]}
                onValueChange={(value) => setVolatilityFactor(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Lower values = more conservative sizing in volatile markets
              </p>
            </div>
          )}
          
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
            {applyToAllCoins ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Apply Risk Parameters to All Coins
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Position Size
              </>
            )}
          </Button>
          
          {!applyToAllCoins && (
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
          )}
          
          {applyToAllCoins && (
            <div className="p-4 rounded-md bg-muted">
              <div className="text-sm font-medium">Multi-Asset Risk Management</div>
              <div className="text-sm text-muted-foreground mt-1">
                Risk of {riskPercentage}% will be applied to all monitored coins with appropriate position sizing.
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="kelly" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="account-size-kelly">Account Size ($)</Label>
            <Input
              id="account-size-kelly"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              type="number"
              min="0"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="win-rate">Win Rate (%)</Label>
                <span className="text-sm text-muted-foreground">{winRate}%</span>
              </div>
              <Slider
                id="win-rate"
                min={30}
                max={80}
                step={1}
                value={[winRate]}
                onValueChange={(value) => setWinRate(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="win-loss-ratio">Win/Loss Ratio</Label>
                <span className="text-sm text-muted-foreground">{winLossRatio.toFixed(1)}</span>
              </div>
              <Slider
                id="win-loss-ratio"
                min={0.5}
                max={3}
                step={0.1}
                value={[winLossRatio]}
                onValueChange={(value) => setWinLossRatio(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Average winner size / Average loser size
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">Strategy Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-xs">
                <span className="text-muted-foreground">Expected Value:</span>
                <span className="float-right font-medium">
                  {((winRate/100 * winLossRatio) - (1 - winRate/100)).toFixed(2)}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Profit Factor:</span>
                <span className="float-right font-medium">
                  {(winRate/100 * winLossRatio / (1 - winRate/100)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={calculateKellyPosition}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Kelly Position Size
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-md bg-muted">
              <div className="text-sm text-muted-foreground">Kelly Position Size</div>
              <div className="text-xl font-bold">${kellySize}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Half-Kelly applied for safety
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-muted">
              <div className="text-sm text-muted-foreground">Optimal Risk (%)</div>
              <div className="text-xl font-bold">{kellyPercentage}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                of account per trade
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Kelly Criterion Information</div>
            <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              The Kelly Criterion calculates the optimal position size based on your win rate and win/loss ratio. Many professional traders use half-Kelly (50% of the calculated value) to reduce variance.
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
