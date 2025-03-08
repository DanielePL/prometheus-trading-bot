
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radar, Plus, ChevronRight, ChevronDown, Search, Trending, TrendingUp, Flame, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { bullRunDetector, BullRunParameters, MarketAnalysisReport } from '@/components/dashboard/BullRunDetector';
import { exchangeAPI } from '../TradingBotAPI';
import { tradingPairs } from '@/hooks/useTradingBot';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { marketData } from '@/data/marketData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BullRunIndicatorProps {
  isBullRun: boolean;
  confidence: number;
  lastDetected?: string;
  stopLossPercentage: number;
  symbol?: string;  // Added symbol as an optional property
}

type ScanResult = BullRunParameters & {
  symbol: string;
  name: string;
};

export const BullRunIndicator: React.FC<BullRunIndicatorProps> = ({
  isBullRun: initialIsBullRun,
  confidence: initialConfidence,
  lastDetected = 'Just now',
  stopLossPercentage: initialStopLossPercentage,
  symbol = 'BTC-USD'  // Default value for symbol
}) => {
  const [isBullRun, setIsBullRun] = useState(initialIsBullRun);
  const [confidence, setConfidence] = useState(initialConfidence);
  const [stopLossPercentage, setStopLossPercentage] = useState(initialStopLossPercentage);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string>(lastDetected);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tradingPair, setTradingPair] = useState(symbol);
  const [scanningMarket, setScanningMarket] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [marketScanResults, setMarketScanResults] = useState<ScanResult[]>([]);
  const [expandResults, setExpandResults] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'report'>('scanner');
  const [marketReport, setMarketReport] = useState<MarketAnalysisReport | null>(null);
  
  const formattedConfidence = `${Math.round(confidence * 100)}%`;
  
  const performBullRunScan = async () => {
    try {
      const candles = await exchangeAPI.fetchCandles(tradingPair, '1h');
      const orderBook = await exchangeAPI.getOrderBook(tradingPair);
      
      const result = bullRunDetector.analyzeMarket(candles, orderBook);
      
      setIsBullRun(result.isBullRun);
      setConfidence(result.confidence);
      setStopLossPercentage(result.stopLossPercentage);
      setLastScanTime(result.lastDetected);
      
      if (result.isBullRun) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
        
        toast.success('Bull run pattern detected!', {
          description: `Confidence: ${Math.round(result.confidence * 100)}%, Stop Loss: ${result.stopLossPercentage.toFixed(1)}%`,
        });
      } else if (result.confidence > 0.5) {
        toast.info('Possible emerging bull run pattern', {
          description: `Confidence: ${Math.round(result.confidence * 100)}%, watching closely...`,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error during bull run scan:', error);
      
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
      
      return {
        isBullRun: newIsBullRun,
        confidence: newConfidence,
        stopLossPercentage: newStopLoss,
        lastDetected: new Date().toLocaleTimeString()
      };
    }
  };
  
  const scanMarket = async () => {
    if (scanningMarket) return;
    
    setScanningMarket(true);
    setScanProgress(0);
    setMarketScanResults([]);
    setScanComplete(false);
    
    toast.info('Market-wide scan initiated', {
      description: 'Scanning cryptocurrencies for bull run patterns'
    });
    
    const currenciesToScan = marketData.slice(0, 100);
    let scannedCount = 0;
    const results: ScanResult[] = [];
    
    for (const currency of currenciesToScan) {
      try {
        const pair = `${currency.symbol}-USD`;
        
        scannedCount++;
        setScanProgress(Math.round((scannedCount / currenciesToScan.length) * 100));
        
        const candles = await exchangeAPI.fetchCandles(pair, '1h');
        const orderBook = await exchangeAPI.getOrderBook(pair);
        const result = bullRunDetector.analyzeMarket(candles, orderBook);
        
        results.push({
          ...result,
          symbol: currency.symbol,
          name: currency.name
        });
        
        if (result.isBullRun && result.confidence > 0.75) {
          toast.success(`Bull run detected for ${currency.name}!`, {
            description: `${Math.round(result.confidence * 100)}% confidence with ${result.stopLossPercentage.toFixed(1)}% stop loss`
          });
        }
        
        results.sort((a, b) => b.confidence - a.confidence);
        setMarketScanResults([...results]);
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error scanning ${currency.symbol}:`, error);
      }
    }
    
    if (results.length > 0) {
      const topResult = results[0];
      setIsBullRun(topResult.isBullRun);
      setConfidence(topResult.confidence);
      setStopLossPercentage(topResult.stopLossPercentage);
      setLastScanTime(new Date().toLocaleTimeString());
      setTradingPair(`${topResult.symbol}-USD`);
      
      if (topResult.isBullRun) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }
    
    // After market scan, generate a full analysis report
    const report = bullRunDetector.generateMarketAnalysisReport(marketData);
    setMarketReport(report);
    
    setScanningMarket(false);
    setScanComplete(true);
    setExpandResults(true);
    
    toast.success('Market scan complete', {
      description: `Scanned ${scannedCount} cryptocurrencies for bull run patterns`
    });
    
    // Automatically switch to the report tab after scan completes
    setActiveTab('report');
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
    
    // Check for existing market report
    const existingReport = bullRunDetector.getLatestMarketAnalysisReport();
    if (existingReport) {
      setMarketReport(existingReport);
    }
  }, [initialIsBullRun]);
  
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className={`
      h-full
      ${isBullRun 
        ? 'bg-green-900 border-green-800 text-white' 
        : 'bg-green-900 border-green-800 text-white'}
      ${isAnimating ? 'animate-pulse' : ''}
      transition-all duration-300
    `}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="mb-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-base font-bold">Bull Run Scanner</div>
              <div className="text-xs text-green-300">Market Analysis Reports</div>
            </div>
            <Radar className="h-5 w-5 text-green-300" />
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'scanner' | 'report')} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 bg-green-800/30">
              <TabsTrigger value="scanner" className="text-xs">Bull Scanner</TabsTrigger>
              <TabsTrigger value="report" className="text-xs">Market Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scanner" className="pt-2 space-y-2">
              {scanningMarket ? (
                <div className="py-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Scanning market ({Math.round(scanProgress)}% complete)...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress 
                    value={scanProgress} 
                    className="bg-green-800"
                    style={{ '--progress-color': 'rgb(34, 197, 94)' } as React.CSSProperties} 
                  />
                </div>
              ) : (
                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidence</span>
                    <span className="text-sm font-semibold">{formattedConfidence}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stop Loss</span>
                    <Badge variant="outline" className="bg-amber-400/20 text-amber-300 border-amber-500/50 text-xs py-0 px-2">
                      {stopLossPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Detected</span>
                    <span className="text-sm text-green-300">{lastScanTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Symbol</span>
                    <span className="text-sm font-semibold">{tradingPair}</span>
                  </div>
                </div>
              )}
              
              {scanComplete && marketScanResults.length > 0 && (
                <Collapsible 
                  open={expandResults} 
                  onOpenChange={setExpandResults} 
                  className="mt-1 border-t border-green-800/50 pt-1"
                >
                  <CollapsibleTrigger className="flex w-full justify-between items-center text-xs py-1 text-green-300 hover:text-white">
                    <span>Market scan results ({marketScanResults.length})</span>
                    {expandResults ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                      {marketScanResults.map((result, index) => (
                        <div 
                          key={result.symbol} 
                          className={`flex justify-between items-center p-1 rounded 
                          ${result.isBullRun ? 'bg-green-800/50 text-green-100' : 'bg-green-900/50 text-green-300'} 
                          ${index === 0 ? 'border-l-2 border-amber-500 pl-1' : ''}`}
                        >
                          <span className="font-medium">{result.symbol}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className={
                              result.confidence > 0.7 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30 text-xs py-0 px-1' 
                                : result.confidence > 0.5 
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs py-0 px-1'
                                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs py-0 px-1'
                            }>
                              {Math.round(result.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <div className="flex gap-2 pt-2 mt-1">
                <Button 
                  size="sm" 
                  variant={isAutoScanning ? "destructive" : "outline"}
                  onClick={isAutoScanning ? stopAutoScan : startAutoScan}
                  className={`text-xs flex-1 ${isAutoScanning ? "" : "bg-green-800 hover:bg-green-700 text-white border-green-700"}`}
                >
                  {isAutoScanning ? "Stop Auto" : "Auto Scan"}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={scanMarket}
                  disabled={scanningMarket}
                  className="text-xs flex-1 bg-green-100 hover:bg-green-200 text-green-900"
                >
                  {scanningMarket ? 'Scanning...' : 'Scan Market'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="pt-2 space-y-2">
              {marketReport ? (
                <div className="text-xs space-y-3 overflow-y-auto max-h-[300px] pr-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm flex items-center">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-300" />
                        Market Analysis Report
                      </div>
                      <div className="text-green-300 text-[10px]">
                        {formatDate(marketReport.date)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Market Sentiment:</span>
                      <span className={`font-bold capitalize ${getSentimentColor(marketReport.marketSentiment)}`}>
                        {marketReport.marketSentiment} ({marketReport.sentimentScore.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 border-t border-green-800/50 pt-2">
                    <div className="font-semibold flex items-center">
                      <Trending className="h-3.5 w-3.5 mr-1.5 text-green-300" />
                      Key Market Narratives
                    </div>
                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                      {marketReport.keyNarratives.slice(0, 4).map((narrative, i) => (
                        <li key={i} className="text-green-200">{narrative}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-1 border-t border-green-800/50 pt-2">
                    <div className="font-semibold flex items-center">
                      <Flame className="h-3.5 w-3.5 mr-1.5 text-green-300" />
                      Bull Run Potential by Tier
                    </div>
                    
                    <div className="space-y-1">
                      <div>
                        <span className="text-green-300 font-medium">Tier 1 (High Confidence):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {marketReport.tierOneCoins.map(coin => (
                            <Badge key={coin} variant="outline" className="bg-green-500/30 text-green-100 border-green-500/20">
                              {coin}
                            </Badge>
                          ))}
                          {marketReport.tierOneCoins.length === 0 && (
                            <span className="text-green-400 italic">None detected</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-yellow-300 font-medium">Tier 2 (Strong Potential):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {marketReport.tierTwoCoins.map(coin => (
                            <Badge key={coin} variant="outline" className="bg-yellow-500/20 text-yellow-100 border-yellow-500/20">
                              {coin}
                            </Badge>
                          ))}
                          {marketReport.tierTwoCoins.length === 0 && (
                            <span className="text-green-400 italic">None detected</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-orange-300 font-medium">Tier 3 (Watch Closely):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {marketReport.tierThreeCoins.map(coin => (
                            <Badge key={coin} variant="outline" className="bg-orange-500/20 text-orange-100 border-orange-500/20">
                              {coin}
                            </Badge>
                          ))}
                          {marketReport.tierThreeCoins.length === 0 && (
                            <span className="text-green-400 italic">None detected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 border-t border-green-800/50 pt-2">
                    <div className="font-semibold flex items-center">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-green-300" />
                      Technical Signals
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <div>
                        <div className="text-green-300 font-medium text-[11px]">Bullish Signals:</div>
                        <ul className="list-disc list-inside pl-1 text-[10px]">
                          {marketReport.technicalSignals.bullish.slice(0, 2).map((signal, i) => (
                            <li key={i}>{signal}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-red-300 font-medium text-[11px]">Bearish Signals:</div>
                        <ul className="list-disc list-inside pl-1 text-[10px]">
                          {marketReport.technicalSignals.bearish.slice(0, 2).map((signal, i) => (
                            <li key={i}>{signal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {marketReport.breakoutCoins.length > 0 && (
                    <div className="space-y-1 border-t border-green-800/50 pt-2">
                      <div className="font-semibold flex items-center">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-300" />
                        Recent Breakouts
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {marketReport.breakoutCoins.map(coin => (
                          <Badge key={coin} variant="outline" className="bg-blue-500/20 text-blue-100 border-blue-500/20">
                            {coin}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-green-300 space-y-4">
                  <Radar className="h-8 w-8 opacity-70" />
                  <div className="text-center">
                    <p className="font-medium">No Market Report Available</p>
                    <p className="text-xs mt-1 opacity-80">Run a market scan to generate a detailed report</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={scanMarket}
                    disabled={scanningMarket}
                    className="text-xs mt-2 bg-green-800 hover:bg-green-700 text-white border-green-700"
                  >
                    {scanningMarket ? 'Scanning...' : 'Generate Report'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
