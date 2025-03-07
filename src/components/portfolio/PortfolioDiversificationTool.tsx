
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  PieChart, 
  Chart, 
  DollarSign, 
  CopyPlus,
  Layers, 
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  useToast 
} from '@/hooks/use-toast';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

// Current portfolio allocation (mock data)
const currentAllocation = [
  { name: 'Bitcoin', value: 45, color: '#F7931A' },
  { name: 'Ethereum', value: 30, color: '#627EEA' },
  { name: 'Solana', value: 15, color: '#00FFA3' },
  { name: 'Cardano', value: 8, color: '#0033AD' },
  { name: 'USDT', value: 2, color: '#26A17B' },
];

// Suggested diversified portfolio (mock data)
const suggestedAllocation = [
  { name: 'Bitcoin', value: 30, color: '#F7931A' },
  { name: 'Ethereum', value: 25, color: '#627EEA' },
  { name: 'Solana', value: 10, color: '#00FFA3' },
  { name: 'Cardano', value: 5, color: '#0033AD' },
  { name: 'Polkadot', value: 5, color: '#E6007A' },
  { name: 'Chainlink', value: 5, color: '#2A5ADA' },
  { name: 'Avalanche', value: 5, color: '#E84142' },
  { name: 'S&P 500 ETF', value: 10, color: '#1E88E5' },
  { name: 'USDT', value: 5, color: '#26A17B' },
];

export const PortfolioDiversificationTool = () => {
  const [portfolioValue, setPortfolioValue] = useState("100000");
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [investmentHorizon, setInvestmentHorizon] = useState("medium");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const getRiskToleranceText = () => {
    if (riskTolerance <= 1) return "Very Conservative";
    if (riskTolerance <= 2) return "Conservative";
    if (riskTolerance <= 3) return "Moderate";
    if (riskTolerance <= 4) return "Aggressive";
    return "Very Aggressive";
  };
  
  const getHorizonText = () => {
    switch (investmentHorizon) {
      case "short": return "Short-term (< 1 year)";
      case "medium": return "Medium-term (1-3 years)";
      case "long": return "Long-term (3+ years)";
      default: return "";
    }
  };
  
  const analyzePortfolio = () => {
    setIsLoading(true);
    toast({
      title: "Analyzing Portfolio",
      description: "Calculating optimal diversification strategy",
    });
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsLoading(false);
      setShowRecommendation(true);
      toast({
        title: "Analysis Complete",
        description: "Portfolio diversification recommendation ready",
      });
    }, 2000);
  };
  
  const applyRecommendation = () => {
    toast({
      title: "Recommendation Applied",
      description: "Portfolio rebalancing instructions have been generated",
    });
  };
  
  const calculateRebalanceActions = () => {
    const actions = [];
    const totalValue = parseFloat(portfolioValue);
    
    // Calculate differences between current and suggested allocations
    const differences = new Map();
    
    currentAllocation.forEach(asset => {
      differences.set(asset.name, {
        currentPct: asset.value,
        suggestedPct: 0,
        change: 0
      });
    });
    
    suggestedAllocation.forEach(asset => {
      if (differences.has(asset.name)) {
        const current = differences.get(asset.name);
        current.suggestedPct = asset.value;
        current.change = asset.value - current.currentPct;
        differences.set(asset.name, current);
      } else {
        differences.set(asset.name, {
          currentPct: 0,
          suggestedPct: asset.value,
          change: asset.value
        });
      }
    });
    
    // Generate action items
    differences.forEach((value, key) => {
      const amountChange = (totalValue * value.change / 100).toFixed(2);
      const action = value.change > 0 ? "Buy" : "Sell";
      
      if (value.change !== 0) {
        actions.push({
          asset: key,
          action,
          amount: `$${Math.abs(amountChange)}`,
          changePercent: `${value.change > 0 ? '+' : ''}${value.change.toFixed(1)}%`
        });
      }
    });
    
    return actions;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          Portfolio Diversification
        </CardTitle>
        <CardDescription>
          Optimize your portfolio allocation for risk and return
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showRecommendation ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-value">Portfolio Value ($)</Label>
              <Input
                id="portfolio-value"
                type="number"
                min="1000"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                <span className="text-sm text-muted-foreground">{getRiskToleranceText()}</span>
              </div>
              <Slider
                id="risk-tolerance"
                min={1}
                max={5}
                step={1}
                value={[riskTolerance]}
                onValueChange={(value) => setRiskTolerance(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investment-horizon">Investment Horizon</Label>
              <Select value={investmentHorizon} onValueChange={setInvestmentHorizon}>
                <SelectTrigger id="investment-horizon">
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short-term (< 1 year)</SelectItem>
                  <SelectItem value="medium">Medium-term (1-3 years)</SelectItem>
                  <SelectItem value="long">Long-term (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Current Allocation</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={currentAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {currentAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Allocation']}
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={analyzePortfolio}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Analyze and Recommend Diversification
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Portfolio Analysis</h3>
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Portfolio Value:</span>
                  <span className="float-right font-medium">${portfolioValue}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Profile:</span>
                  <span className="float-right font-medium">{getRiskToleranceText()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time Horizon:</span>
                  <span className="float-right font-medium">{getHorizonText()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Diversification Score:</span>
                  <span className="float-right font-medium text-amber-500">6.4/10</span>
                </div>
              </div>
              
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded text-sm text-amber-800 dark:text-amber-300">
                <strong>Analysis:</strong> Your current portfolio shows high concentration in Bitcoin (45%) and 
                Ethereum (30%), creating significant crypto market exposure. Consider diversifying 
                across more assets and adding traditional markets exposure for better risk-adjusted returns.
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Current Allocation</h3>
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={currentAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {currentAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Allocation']}
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Recommended Allocation</h3>
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={suggestedAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {suggestedAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Allocation']}
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Rebalancing Actions</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {calculateRebalanceActions().map((action, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded ${action.action === 'Buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {action.action}
                      </span>
                      <span className="ml-2 font-medium">{action.asset}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{action.amount}</div>
                      <div className={`text-xs ${action.changePercent.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {action.changePercent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2 flex flex-col md:flex-row gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={applyRecommendation}
              >
                <CopyPlus className="mr-2 h-4 w-4" />
                Apply Recommendation
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRecommendation(false)}
              >
                <PieChart className="mr-2 h-4 w-4" />
                Adjust Parameters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
