
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Radar } from 'lucide-react';
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
  
  const formattedConfidence = `${Math.round(confidence * 100)}%`;
  
  const performBullRunScan = () => {
    const newIsBullRun = Math.random() > 0.4;
    const newConfidence = 0.65 + (Math.random() * 0.3);
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
  
  const startAutoScan = () => {
    if (isAutoScanning) return;
    
    toast.info('Auto-scan enabled', {
      description: 'Scanner will check for bull run patterns every 30 seconds'
    });
    
    setIsAutoScanning(true);
    performBullRunScan();
    
    const interval = setInterval(() => {
      performBullRunScan();
    }, 30000);
    
    setScanInterval(interval);
  };
  
  const stopAutoScan = () => {
    if (!isAutoScanning || !scanInterval) return;
    
    clearInterval(scanInterval);
    setScanInterval(null);
    setIsAutoScanning(false);
    
    toast.info('Auto-scan disabled');
  };
  
  useEffect(() => {
    if (initialIsBullRun) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [initialIsBullRun]);
  
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);
  
  return (
    <Card className={`
      w-[5cm] h-[5cm] 
      ${isBullRun 
        ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
        : 'border-gray-200 dark:border-gray-800 bg-background'}
      ${isAnimating ? 'animate-pulse' : ''}
      transition-all duration-300 overflow-hidden
    `}>
      <CardContent className="p-3 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${isBullRun ? 
              'text-green-500 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">Bull Run Detector</span>
          </div>
          
          {isBullRun && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse text-xs py-0 px-2">
              Active
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 flex-grow">
          {isBullRun ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm font-semibold">{formattedConfidence}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stop Loss</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs py-0 px-1">
                  {stopLossPercentage.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Detected</span>
                <span className="text-xs text-muted-foreground">{lastScanTime}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-center text-muted-foreground py-4">
              {isAutoScanning ? 'Scanning for patterns...' : 'No bull run detected'}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <Radar className={`h-3 w-3 mr-1 ${isAutoScanning ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-xs text-muted-foreground">
              {isAutoScanning ? 'Auto' : 'Manual'}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant={isAutoScanning ? "destructive" : "default"}
            onClick={isAutoScanning ? stopAutoScan : startAutoScan}
            className="text-xs h-7 px-2 min-w-0"
          >
            {isAutoScanning ? 'Stop' : 'Scan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
