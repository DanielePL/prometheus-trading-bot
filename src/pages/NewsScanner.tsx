
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NewsSourceManager } from '@/components/news/NewsSourceManager';
import { NewsResults } from '@/components/news/NewsResults';
import { ScanStatusCard } from '@/components/news/ScanStatusCard';
import { SemanticInsights } from '@/components/news/SemanticInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { scanAllSources } from '@/services/newsCrawlerService';
import { RefreshCw, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NewsScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('news');
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [scanInterval, setScanInterval] = useState('15');
  const [timeUntilNextScan, setTimeUntilNextScan] = useState<number | null>(null);
  const [scanTimer, setScanTimer] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Check if auto-scan was previously enabled
    const savedAutoScan = localStorage.getItem('headerNewsScanAutoEnabled');
    const savedInterval = localStorage.getItem('headerNewsScanInterval');
    
    if (savedAutoScan === 'true') {
      setAutoScanEnabled(true);
    }
    
    if (savedInterval) {
      setScanInterval(savedInterval);
    }
    
    return () => {
      if (scanTimer) {
        clearInterval(scanTimer);
      }
    };
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
    localStorage.setItem('headerNewsScanAutoEnabled', enabled.toString());
    
    if (enabled) {
      startAutoScanTimer();
    }
  };
  
  const handleIntervalChange = (value: string) => {
    setScanInterval(value);
    localStorage.setItem('headerNewsScanInterval', value);
    
    if (autoScanEnabled) {
      startAutoScanTimer();
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
  
  const handleScan = async () => {
    setIsScanning(true);
    try {
      await scanAllSources();
      toast.success('Scan completed successfully');
    } catch (error) {
      toast.error('Scan failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
            <p className="text-muted-foreground mt-1">
              Scan crypto markets and news sources to enhance trading decisions
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4">
              <Button 
                variant="default" 
                className="gap-2 w-full" 
                onClick={handleScan}
                disabled={isScanning}
              >
                <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan News'}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="header-auto-scan" 
                  checked={autoScanEnabled}
                  onCheckedChange={toggleAutoScan}
                  aria-label="Enable auto scan"
                />
              </div>
            </div>
            
            {autoScanEnabled && (
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <span>Auto every:</span>
                </div>
                
                <Select
                  value={scanInterval}
                  onValueChange={handleIntervalChange}
                >
                  <SelectTrigger className="h-7 w-24">
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
                
                {timeUntilNextScan !== null && (
                  <span className="text-muted-foreground whitespace-nowrap">
                    Next: {formatTimeRemaining(timeUntilNextScan)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="news">News & Analysis</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <NewsResults />
                </div>
                
                <div className="space-y-6">
                  <ScanStatusCard />
                  <SemanticInsights />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources">
            <NewsSourceManager />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default NewsScanner;
