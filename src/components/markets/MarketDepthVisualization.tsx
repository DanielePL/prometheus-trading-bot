
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exchangeAPI, OrderBook } from '@/components/trading/TradingBotAPI';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MarketDepthVisualizationProps {
  symbol: string;
  depth?: number;
}

export const MarketDepthVisualization: React.FC<MarketDepthVisualizationProps> = ({ 
  symbol = 'BTC-USD',
  depth = 10 
}) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Prepare data for visualization
  const prepareDepthData = (orderBook: OrderBook | null, midPrice: number | null) => {
    if (!orderBook || !midPrice) return [];
    
    const data = [];
    
    // Process asks (sell orders) - higher than market price
    const asksData = orderBook.asks.slice(0, depth).map(([price, volume]) => ({
      price,
      volume,
      type: 'ask'
    }));
    
    // Process bids (buy orders) - lower than market price
    const bidsData = orderBook.bids.slice(0, depth).map(([price, volume]) => ({
      price,
      volume,
      type: 'bid'
    }));
    
    // Sort all data by price
    return [...bidsData, ...asksData].sort((a, b) => a.price - b.price);
  };
  
  // Calculate cumulative volumes
  const calculateCumulativeVolumes = (data: any[]) => {
    if (!data || data.length === 0) return [];
    
    let bidCumulative = 0;
    let askCumulative = 0;
    
    return data.map(item => {
      if (item.type === 'bid') {
        bidCumulative += item.volume;
        return {
          ...item,
          bidVolume: item.volume,
          bidCumulative,
          askVolume: 0,
          askCumulative: 0,
          formattedPrice: formatPrice(item.price)
        };
      } else {
        askCumulative += item.volume;
        return {
          ...item,
          askVolume: item.volume,
          askCumulative,
          bidVolume: 0,
          bidCumulative: 0,
          formattedPrice: formatPrice(item.price)
        };
      }
    });
  };
  
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    if (price >= 100) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
    }
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background border border-border p-3 rounded shadow-md">
          <p className="font-medium">{data.formattedPrice}</p>
          {data.bidVolume > 0 && (
            <p className="text-green-500">
              Bid: {data.bidVolume.toFixed(4)} ({data.bidCumulative.toFixed(2)})
            </p>
          )}
          {data.askVolume > 0 && (
            <p className="text-red-500">
              Ask: {data.askVolume.toFixed(4)} ({data.askCumulative.toFixed(2)})
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  // Fetch order book data
  const fetchOrderBook = async () => {
    try {
      setIsLoading(true);
      
      // Fetch latest market price
      const marketData = await exchangeAPI.fetchMarketData(symbol);
      setMarketPrice(marketData.price);
      
      // Fetch order book
      const book = await exchangeAPI.getOrderBook(symbol);
      setOrderBook(book);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching order book:', error);
      toast.error('Failed to load market depth data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      // Turn off auto-refresh
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      setAutoRefresh(false);
      toast.info('Auto-refresh disabled');
    } else {
      // Turn on auto-refresh
      fetchOrderBook();
      const interval = setInterval(() => {
        fetchOrderBook();
      }, 5000);
      setRefreshInterval(interval);
      setAutoRefresh(true);
      toast.success('Auto-refresh enabled (5s)');
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchOrderBook();
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [symbol]);
  
  // Prepare chart data
  const depthData = orderBook && marketPrice 
    ? prepareDepthData(orderBook, marketPrice) 
    : [];
  
  const chartData = calculateCumulativeVolumes(depthData);
  
  // Calculate bid-ask spread
  const spread = orderBook && orderBook.asks.length > 0 && orderBook.bids.length > 0
    ? orderBook.asks[0][0] - orderBook.bids[0][0]
    : 0;
    
  const spreadPercentage = marketPrice && spread 
    ? (spread / marketPrice * 100).toFixed(3) 
    : '0.000';
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              Market Depth 
              <Badge className="ml-2 bg-accent/20 text-accent" variant="outline">
                {symbol}
              </Badge>
            </CardTitle>
            <CardDescription>
              Order book visualization
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {marketPrice && (
              <Badge variant="secondary" className="h-7 px-3 font-medium text-white bg-blue-600/90">
                ${marketPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-7 ${isLoading ? 'opacity-50' : ''}`}
              onClick={fetchOrderBook}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant={autoRefresh ? "destructive" : "outline"}
              size="sm"
              className="h-7"
              onClick={toggleAutoRefresh}
            >
              <ActivityIcon className={`h-3.5 w-3.5 mr-1 ${autoRefresh ? 'animate-pulse' : ''}`} />
              {autoRefresh ? 'Stop' : 'Auto'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="text-sm text-muted-foreground">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </div>
          
          {spread > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Spread:</span>
              <Badge variant="outline" className="h-5 px-2 text-xs">
                {formatPrice(spread)} ({spreadPercentage}%)
              </Badge>
            </div>
          )}
        </div>
        
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="formattedPrice" 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: 'var(--border)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: 'var(--border)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  label={{ value: 'Cumulative Volume', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="bidCumulative" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e20" 
                  activeDot={{ r: 6 }}
                  strokeWidth={1.5}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="askCumulative" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef444420" 
                  activeDot={{ r: 6 }}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-muted-foreground text-sm">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                    Loading market data...
                  </div>
                ) : (
                  'No market depth data available'
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-muted-foreground">Buy Orders</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-muted-foreground">Sell Orders</span>
          </div>
          {marketPrice && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-muted-foreground">Current Price: {formatPrice(marketPrice)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
