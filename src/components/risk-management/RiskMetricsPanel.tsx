
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingDown, BadgePercent } from 'lucide-react';

export const RiskMetricsPanel = () => {
  // These would typically be calculated from actual portfolio data
  // For now, we'll use mock data
  const metrics = {
    portfolioHeatIndex: 68,
    drawdown: 12.3,
    correlationRisk: 45,
    volatility: 34.2,
    sharpeRatio: 1.85,
    sortinoRatio: 2.1
  };
  
  const getRiskColor = (value: number, isInverse: boolean = false) => {
    const thresholds = isInverse 
      ? { low: 70, medium: 40 } 
      : { low: 30, medium: 60 };
    
    if (value <= thresholds.low) {
      return isInverse ? "text-red-500" : "text-green-500";
    } else if (value <= thresholds.medium) {
      return "text-amber-500";
    } else {
      return isInverse ? "text-green-500" : "text-red-500";
    }
  };
  
  const getProgressColor = (value: number, isInverse: boolean = false) => {
    const thresholds = isInverse 
      ? { low: 70, medium: 40 } 
      : { low: 30, medium: 60 };
    
    if (value <= thresholds.low) {
      return isInverse ? "bg-red-500" : "bg-green-500";
    } else if (value <= thresholds.medium) {
      return "bg-amber-500";
    } else {
      return isInverse ? "bg-green-500" : "bg-red-500";
    }
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Portfolio Heat Warning</AlertTitle>
        <AlertDescription>
          Your portfolio is showing elevated risk levels. Consider diversification.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>Portfolio Heat Index</span>
            </div>
            <span className={getRiskColor(metrics.portfolioHeatIndex)}>{metrics.portfolioHeatIndex}%</span>
          </div>
          <Progress 
            value={metrics.portfolioHeatIndex} 
            className="h-2" 
            style={{ 
              '--progress-color': getProgressColor(metrics.portfolioHeatIndex) 
            } as React.CSSProperties} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <BadgePercent className="h-4 w-4 mr-1" />
              <span>Maximum Drawdown</span>
            </div>
            <span className={getRiskColor(metrics.drawdown)}>{metrics.drawdown}%</span>
          </div>
          <Progress 
            value={metrics.drawdown} 
            className="h-2" 
            style={{ 
              '--progress-color': getProgressColor(metrics.drawdown) 
            } as React.CSSProperties} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Correlation Risk</span>
            <span className={getRiskColor(metrics.correlationRisk)}>{metrics.correlationRisk}%</span>
          </div>
          <Progress 
            value={metrics.correlationRisk} 
            className="h-2" 
            style={{ 
              '--progress-color': getProgressColor(metrics.correlationRisk) 
            } as React.CSSProperties} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Portfolio Volatility</span>
            <span className={getRiskColor(metrics.volatility)}>{metrics.volatility}%</span>
          </div>
          <Progress 
            value={metrics.volatility} 
            className="h-2" 
            style={{ 
              '--progress-color': getProgressColor(metrics.volatility) 
            } as React.CSSProperties} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-md bg-muted">
          <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
          <div className={`text-xl font-bold ${metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Risk-adjusted return (higher is better)
          </div>
        </div>
        
        <div className="p-4 rounded-md bg-muted">
          <div className="text-sm text-muted-foreground">Sortino Ratio</div>
          <div className={`text-xl font-bold ${metrics.sortinoRatio > 1 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics.sortinoRatio.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Downside risk-adjusted return
          </div>
        </div>
      </div>
    </div>
  );
};
