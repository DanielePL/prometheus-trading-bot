
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, TrendingUp, BadgeDollarSign, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface RiskManagerProps {
  tradingPair: string;
  tradeMode: 'paper' | 'live';
  portfolioValue: number;
  isRunning: boolean;
}

export const RiskManager = ({ tradingPair, tradeMode, portfolioValue, isRunning }: RiskManagerProps) => {
  const [maxPositionSize, setMaxPositionSize] = useState<number>(5);
  const [stopLossPercentage, setStopLossPercentage] = useState<number>(3);
  const [dailyLossLimit, setDailyLossLimit] = useState<number>(2);
  const [activeTab, setActiveTab] = useState('limits');
  
  // Risk metrics - would be calculated by a risk model in a real system
  const currentRiskScore = 68; // 0-100 scale
  const potentialDrawdown = 12.4; // percentage
  const volatilityIndex = 7.2; // 0-10 scale
  const exposureRisk = 28; // percentage
  
  const handleSaveSettings = () => {
    toast.success('Risk management settings saved');
  };
  
  const calculatePositionSize = (percentage: number): number => {
    return (portfolioValue * percentage) / 100;
  };
  
  const riskByPair: Record<string, number> = {
    'BTC-USD': 8.5,
    'ETH-USD': 7.8,
    'SOL-USD': 9.2,
    'DOGE-USD': 9.8,
    'ADA-USD': 7.5
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base">Risk Management</CardTitle>
          <CardDescription>Control exposure and protect your capital</CardDescription>
        </div>
        <Shield className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="limits">Risk Limits</TabsTrigger>
            <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="limits" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Position Size (%)</label>
                <span className="text-sm text-muted-foreground">{maxPositionSize}% (${calculatePositionSize(maxPositionSize).toFixed(2)})</span>
              </div>
              <Slider
                value={[maxPositionSize]}
                min={1}
                max={30}
                step={1}
                disabled={isRunning}
                onValueChange={(values) => setMaxPositionSize(values[0])}
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Stop Loss (%)</label>
                <span className="text-sm text-muted-foreground">{stopLossPercentage}%</span>
              </div>
              <Slider
                value={[stopLossPercentage]}
                min={1}
                max={15}
                step={0.5}
                disabled={isRunning}
                onValueChange={(values) => setStopLossPercentage(values[0])}
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Daily Loss Limit (%)</label>
                <span className="text-sm text-muted-foreground">{dailyLossLimit}% (${(portfolioValue * dailyLossLimit / 100).toFixed(2)})</span>
              </div>
              <Slider
                value={[dailyLossLimit]}
                min={0.5}
                max={10}
                step={0.5}
                disabled={isRunning}
                onValueChange={(values) => setDailyLossLimit(values[0])}
              />
            </div>
            
            {tradeMode === 'live' && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High Risk Trading</AlertTitle>
                <AlertDescription>
                  Your current settings indicate a higher risk profile. 
                  Consider lowering position sizes in live trading mode.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleSaveSettings} 
              className="w-full" 
              disabled={isRunning}
            >
              Save Risk Settings
            </Button>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4 pt-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Risk Score</span>
                </div>
                <span className="text-sm font-medium">
                  {currentRiskScore}/100
                </span>
              </div>
              <Progress value={currentRiskScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {currentRiskScore < 40 ? 'Low risk' : currentRiskScore < 70 ? 'Moderate risk' : 'High risk'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Potential Drawdown</span>
                </div>
                <p className="text-xl font-bold">{potentialDrawdown}%</p>
                <p className="text-xs text-muted-foreground">Estimated max loss</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <BadgeDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Exposure Risk</span>
                </div>
                <p className="text-xl font-bold">{exposureRisk}%</p>
                <p className="text-xs text-muted-foreground">Current capital at risk</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{tradingPair} Risk Rating</p>
              <div className="flex items-center">
                <Progress value={riskByPair[tradingPair] * 10 || 50} className="h-2 flex-1" />
                <span className="ml-2 text-sm">{riskByPair[tradingPair]}/10</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Volatility: {volatilityIndex}/10 ({volatilityIndex < 3 ? 'Low' : volatilityIndex < 7 ? 'Moderate' : 'High'})
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
