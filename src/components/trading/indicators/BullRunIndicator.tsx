
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BullRunIndicatorProps {
  isBullRun: boolean;
  confidence: number;
  lastDetected?: string;
  stopLossPercentage: number;
}

export const BullRunIndicator: React.FC<BullRunIndicatorProps> = ({
  isBullRun: initialIsBullRun,
  confidence: initialConfidence,
  lastDetected = 'Just now',
  stopLossPercentage: initialStopLossPercentage
}) => {
  const [isBullRun, setIsBullRun] = useState(initialIsBullRun);
  const [confidence, setConfidence] = useState(initialConfidence);
  const [stopLossPercentage, setStopLossPercentage] = useState(initialStopLossPercentage);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string>(lastDetected);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Format confidence as percentage
  const formattedConfidence = `${Math.round(confidence * 100)}%`;
  
  // Function to simulate a bull run detection scan
  const performBullRunScan = () => {
    // In a real implementation, this would analyze market data
    // For demo purposes, we're using random values
    const newIsBullRun = Math.random() > 0.4; // 60% chance of bull run
    const newConfidence = 0.65 + (Math.random() * 0.3);
    // Convert to number before setting
    const newStopLoss = newIsBullRun ? Math.max(1.0, parseFloat((newConfidence * 10).toFixed(1))) : 1.0;
    
    setIsBullRun(newIsBullRun);
    setConfidence(newConfidence);
    setStopLossPercentage(newStopLoss);
    setLastScanTime(new Date().toLocaleTimeString());
    
    if (newIsBullRun) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
      
      toast.success('Bull run pattern detected!', {
        description: `Confidence: ${Math.round(newConfidence * 100)}%, Stop Loss: ${newStopLoss}%`,
      });
    }
  };
  
  // Start auto-scanning
  const startAutoScan = () => {
    if (isAutoScanning) return;
    
    toast.info('Auto-scan enabled', {
      description: 'Scanner will check for bull run patterns every 30 seconds'
    });
    
    setIsAutoScanning(true);
    performBullRunScan(); // Initial scan
    
    const interval = setInterval(() => {
      performBullRunScan();
    }, 30000); // Scan every 30 seconds
    
    setScanInterval(interval);
  };
  
  // Stop auto-scanning
  const stopAutoScan = () => {
    if (!isAutoScanning || !scanInterval) return;
    
    clearInterval(scanInterval);
    setScanInterval(null);
    setIsAutoScanning(false);
    
    toast.info('Auto-scan disabled');
  };
  
  // Trigger initial animation if bull run is active
  useEffect(() => {
    if (initialIsBullRun) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [initialIsBullRun]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);
  
  return (
    <Card className={`border transition-all duration-300 ${isAnimating ? 'scale-[1.02]' : ''} 
      ${isBullRun 
        ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
        : 'border-gray-200 dark:border-gray-800'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${isBullRun ? 
              'text-green-500 animate-pulse' : 'text-gray-400'}`} />
            Bull Run Scanner
          </div>
          {isBullRun && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <span className={`font-semibold ${isBullRun ? 
              'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
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
                <span className="text-sm text-muted-foreground">{lastScanTime}</span>
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
                {isAutoScanning ? 'Auto-scanning for bullish patterns...' : 'Enable auto-scan to detect bull runs'}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <Radar className={`h-4 w-4 mr-1 ${isAutoScanning ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {isAutoScanning ? 'Auto-scan active' : 'Auto-scan inactive'}
              </span>
            </div>
            
            <Button 
              size="sm" 
              variant={isAutoScanning ? "destructive" : "default"}
              onClick={isAutoScanning ? stopAutoScan : startAutoScan}
              className="text-xs h-8 px-2"
            >
              {isAutoScanning ? 'Stop Scan' : 'Auto Scan'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
