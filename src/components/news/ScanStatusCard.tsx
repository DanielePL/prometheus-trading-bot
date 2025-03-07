
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getLatestScanResult, scanAllSources, ScanResult } from '@/services/newsCrawlerService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Timer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ScanStatusCard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [latestScan, setLatestScan] = useState<ScanResult | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [scanInterval, setScanInterval] = useState('15');
  const [timeUntilNextScan, setTimeUntilNextScan] = useState<number | null>(null);
  const [scanTimer, setScanTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLatestScan(getLatestScanResult());
    
    // Check if auto-scan was previously enabled
    const savedAutoScan = localStorage.getItem('newsScanAutoEnabled');
    const savedInterval = localStorage.getItem('newsScanInterval');
    
    if (savedAutoScan === 'true') {
      setAutoScanEnabled(true);
    }
    
    if (savedInterval) {
      setScanInterval(savedInterval);
    }
  }, []);
  
  // Handle auto-scan timer setup/cleanup
  useEffect(() => {
    if (autoScanEnabled && !scanTimer) {
      startAutoScanTimer();
    } else if (!autoScanEnabled && scanTimer) {
      clearInterval(scanTimer);
      setScanTimer(null);
      setTimeUntilNextScan(null);
    }
    
    return () => {
      if (scanTimer) {
        clearInterval(scanTimer);
      }
    };
  }, [autoScanEnabled, scanInterval]);

  const startAutoScanTimer = () => {
    // Clear any existing timer
    if (scanTimer) {
      clearInterval(scanTimer);
    }
    
    // Convert interval from minutes to milliseconds
    const intervalMs = parseInt(scanInterval) * 60 * 1000;
    setTimeUntilNextScan(parseInt(scanInterval) * 60);
    
    // Start a countdown timer
    const countdownTimer = setInterval(() => {
      setTimeUntilNextScan(prev => {
        if (prev === null || prev <= 0) return null;
        return prev - 1;
      });
    }, 1000);
    
    // Set the main scan timer
    const timer = setInterval(() => {
      if (!isScanning) {
        handleScan();
        setTimeUntilNextScan(parseInt(scanInterval) * 60);
      }
    }, intervalMs);
    
    setScanTimer(timer);
    
    return { scanTimer: timer, countdownTimer };
  };

  const toggleAutoScan = (enabled: boolean) => {
    setAutoScanEnabled(enabled);
    localStorage.setItem('newsScanAutoEnabled', enabled.toString());
    
    if (enabled) {
      const { scanTimer, countdownTimer } = startAutoScanTimer();
    }
  };
  
  const handleIntervalChange = (value: string) => {
    setScanInterval(value);
    localStorage.setItem('newsScanInterval', value);
    
    if (autoScanEnabled) {
      const { scanTimer: newTimer, countdownTimer } = startAutoScanTimer();
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 95);
      });
    }, 400);
    
    try {
      const result = await scanAllSources();
      setLatestScan(result);
      setScanProgress(100);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
      }, 500);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'partial':
        return 'Partial Success';
      default:
        return 'Unknown';
    }
  };
  
  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Control</CardTitle>
        <CardDescription>Scan sources for new market intelligence</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Scanning in progress...</span>
              <span>{Math.floor(scanProgress)}%</span>
            </div>
            <Progress value={scanProgress} className="w-full" />
          </div>
        )}
        
        {latestScan && !isScanning && (
          <div className="space-y-3 py-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Last Scan</h3>
              <div className="flex items-center gap-1">
                {getStatusIcon(latestScan.status)}
                <span className="text-sm">{getStatusText(latestScan.status)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">Time:</div>
              <div className="text-right">{formatDateTime(latestScan.timestamp)}</div>
              
              <div className="text-muted-foreground">Duration:</div>
              <div className="text-right">{latestScan.duration.toFixed(2)}s</div>
              
              <div className="text-muted-foreground">Sources:</div>
              <div className="text-right">{latestScan.sources.length}</div>
              
              <div className="text-muted-foreground">Items found:</div>
              <div className="text-right">{latestScan.totalItems}</div>
            </div>
            
            {latestScan.message && (
              <div className="text-sm text-red-500 mt-2">
                Error: {latestScan.message}
              </div>
            )}
          </div>
        )}
        
        <div className="border-t pt-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-scan" 
                checked={autoScanEnabled}
                onCheckedChange={toggleAutoScan}
              />
              <Label htmlFor="auto-scan">Auto Scan</Label>
            </div>
            
            <Select
              value={scanInterval}
              onValueChange={handleIntervalChange}
              disabled={!autoScanEnabled}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {autoScanEnabled && timeUntilNextScan !== null && (
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Timer className="h-3 w-3 mr-1" />
                <span>Next scan in:</span>
              </div>
              <span>{formatTimeRemaining(timeUntilNextScan)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};
