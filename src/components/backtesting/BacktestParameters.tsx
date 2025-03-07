
import React, { useState, useEffect } from 'react';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Settings 
} from 'lucide-react';

interface BacktestParametersProps {
  strategyType: string;
}

export const BacktestParameters: React.FC<BacktestParametersProps> = ({ strategyType }) => {
  const [parameters, setParameters] = useState<{[key: string]: any}>({});
  
  useEffect(() => {
    // Set default parameters based on strategy type
    switch (strategyType) {
      case "dynamicstoploss":
        setParameters({
          stopLossPercentage: 2.5,
          stopLossRange: [1.0, 5.0],
          trailingStopActivation: 1.5,
          trailingStopRange: [0.5, 3.0],
          confidenceThreshold: 0.65,
          confidenceRange: [0.5, 0.9]
        });
        break;
        
      case "macrossover":
        setParameters({
          shortPeriod: 9,
          shortPeriodRange: [5, 20],
          longPeriod: 21,
          longPeriodRange: [15, 50],
          signalPeriod: 9,
          signalPeriodRange: [5, 15]
        });
        break;
        
      case "rsioscillator":
        setParameters({
          rsiPeriod: 14,
          rsiPeriodRange: [7, 30],
          overbought: 70,
          overboughtRange: [65, 85],
          oversold: 30,
          oversoldRange: [15, 35]
        });
        break;
        
      case "bollingerbands":
        setParameters({
          period: 20,
          periodRange: [10, 50],
          stdDev: 2,
          stdDevRange: [1, 3],
          maType: "sma" // Not a range parameter
        });
        break;
        
      default:
        setParameters({});
    }
  }, [strategyType]);
  
  const handleSliderChange = (param: string, value: number[]) => {
    setParameters(prev => ({
      ...prev,
      [param]: value[0]
    }));
  };
  
  const handleInputChange = (param: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setParameters(prev => ({
        ...prev,
        [param]: numValue
      }));
    }
  };
  
  const renderParameters = () => {
    const paramElements = [];
    
    for (const [key, value] of Object.entries(parameters)) {
      // Skip range parameters
      if (key.includes('Range')) return;
      
      const rangeKey = `${key}Range`;
      const hasRange = parameters[rangeKey] !== undefined;
      
      if (hasRange) {
        const [min, max] = parameters[rangeKey] as number[];
        const displayName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        paramElements.push(
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={key}>{displayName}</Label>
              <Badge variant="outline">{value}</Badge>
            </div>
            <Slider
              id={key}
              min={min}
              max={max}
              step={(max - min) / 20}
              value={[value]}
              onValueChange={(val) => handleSliderChange(key, val)}
            />
          </div>
        );
      }
    }
    
    return paramElements;
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-muted/50">
      <div className="flex items-center space-x-2 mb-2">
        <Settings className="h-4 w-4" />
        <h3 className="text-sm font-medium">Strategy Parameter Optimization</h3>
      </div>
      
      {renderParameters()}
      
      <p className="text-xs text-muted-foreground mt-2">
        The backtest will evaluate multiple parameter combinations to find optimal settings
      </p>
    </div>
  );
};
