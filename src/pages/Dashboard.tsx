
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TradingPairs } from '@/components/dashboard/TradingPairs';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { TradingSystemInfo } from '@/components/dashboard/TradingSystemInfo';
import { SupabaseIntegrationGuide } from '@/components/dashboard/SupabaseIntegrationGuide';
import { BullRunIndicator } from '@/components/trading/indicators/BullRunIndicator';
import { MarketDepthVisualization } from '@/components/markets/MarketDepthVisualization';
import { 
  Wallet, TrendingUp, CircleDollarSign, 
  Landmark, ClipboardCheck, Calendar, Zap, Newspaper,
  BarChart3, RefreshCw, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTradingBot } from '@/hooks/useTradingBot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { toast } from 'sonner';

const Dashboard = () => {
  const [botState, botActions] = useTradingBot();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState("BTC-USD");
  
  const handleDashboardRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate data refreshing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    toast.success('Dashboard data refreshed');
    setIsRefreshing(false);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your Prometheus trading bot performance.
            </p>
          </div>
          
          <div className="flex space-x-2 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDashboardRefresh}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {!botState.isExchangeConnected && (
              <Button onClick={botActions.reconnectExchange} variant="default">
                <Zap className="mr-2 h-4 w-4" />
                Connect Bot
              </Button>
            )}
            {botState.isExchangeConnected && (
              <Button variant="outline" asChild>
                <Link to="/trading-bot">
                  <Zap className="mr-2 h-4 w-4" />
                  Manage Bot
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/news-scanner">
                <Newspaper className="mr-2 h-4 w-4" />
                Market Intelligence
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Portfolio Value"
            value="$10,000.00"
            change={0}
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatsCard
            title="Trading Profit (30d)"
            value="$0.00"
            change={0}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Win Rate"
            value="0.0%"
            change={0}
            icon={<CircleDollarSign className="h-4 w-4" />}
          />
          <BullRunIndicator 
            isBullRun={true}
            confidence={0.85}
            lastDetected="Just now"
            stopLossPercentage={3.5}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="market">Market Depth</TabsTrigger>
                <TabsTrigger value="pairs">Trading Pairs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <PerformanceChart />
              </TabsContent>
              
              <TabsContent value="market">
                <MarketDepthVisualization symbol={activeSymbol} />
              </TabsContent>
              
              <TabsContent value="pairs">
                <TradingPairs onSymbolChange={setActiveSymbol} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-4">
            <Tabs defaultValue="bot" className="w-full">
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="bot" className="flex-1">Bot Status</TabsTrigger>
                <TabsTrigger value="system" className="flex-1">System</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bot">
                <BotStatus />
              </TabsContent>
              
              <TabsContent value="system">
                <TradingSystemInfo />
              </TabsContent>
            </Tabs>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Advanced Analytics
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto max-w-4xl">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Advanced Market Analytics</h3>
                  <div className="text-center text-muted-foreground py-20">
                    Advanced analytics will be implemented soon
                  </div>
                  <div className="mt-4 flex justify-end">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <SupabaseIntegrationGuide />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <RecentTrades />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Balance"
            value="$10,000.00"
            icon={<Landmark className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Trades"
            value="0"
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
          <StatsCard
            title="Days Active"
            value="0"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
        
        <div className="fixed bottom-4 right-4 z-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" className="rounded-full w-12 h-12 bg-primary shadow-lg hover:bg-primary/90">
                <Settings className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto max-w-sm">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">Quick Settings</h3>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    Settings controls will be implemented soon
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
