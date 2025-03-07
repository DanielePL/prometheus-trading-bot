
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface BullRunIndicatorProps {
  isBullRun: boolean;
  confidence: number;
  lastDetected?: string;
  stopLossPercentage: number;
}

export const BullRunIndicator: React.FC<BullRunIndicatorProps> = ({
  isBullRun,
  confidence,
  lastDetected = 'Just now',
  stopLossPercentage
}) => {
  // Format confidence as percentage
  const formattedConfidence = `${Math.round(confidence * 100)}%`;
  
  return (
    <Card className={`border ${isBullRun ? 'border-green-400 dark:border-green-600' : 'border-gray-200 dark:border-gray-800'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${isBullRun ? 'text-green-500' : 'text-gray-400'}`} />
            Bull Run Scanner
          </div>
          {isBullRun && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <span className={`font-semibold ${isBullRun ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              {isBullRun ? 'Bull Run Detected' : 'No Bull Run'}
            </span>
          </div>
          
          {isBullRun && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Confidence</span>
                <span className="font-semibold">{formattedConfidence}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Detected</span>
                <span className="text-sm text-muted-foreground">{lastDetected}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dynamic Stop Loss</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {stopLossPercentage.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-100 dark:border-amber-900/50 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-400">
                  Dynamic stop loss is active. It will adjust based on current profit to protect gains.
                </div>
              </div>
            </>
          )}
          
          {!isBullRun && (
            <div className="p-3 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Scanning market for bullish patterns...
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
