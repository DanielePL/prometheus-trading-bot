
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getLatestScanResult, scanAllSources, ScanResult } from '@/services/newsCrawlerService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const ScanStatusCard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [latestScan, setLatestScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    setLatestScan(getLatestScanResult());
  }, []);

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
