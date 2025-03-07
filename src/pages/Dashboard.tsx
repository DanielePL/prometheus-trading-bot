
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TradingPairs } from '@/components/dashboard/TradingPairs';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { TradingSystemInfo } from '@/components/dashboard/TradingSystemInfo';
import { SupabaseIntegrationGuide } from '@/components/dashboard/SupabaseIntegrationGuide';
import { 
  Wallet, TrendingUp, BarChart2, CircleDollarSign, 
  Landmark, ClipboardCheck, Calendar, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTradingBot } from '@/hooks/useTradingBot';

const Dashboard = () => {
  const { isConnected, connect } = useTradingBot();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your Prometheus trading bot performance.
            </p>
          </div>
          
          <div className="flex space-x-2">
            {!isConnected && (
              <Button onClick={connect} variant="default">
                <Zap className="mr-2 h-4 w-4" />
                Connect Bot
              </Button>
            )}
            {isConnected && (
              <Button variant="outline" asChild>
                <Link to="/trading-bot">
                  <Zap className="mr-2 h-4 w-4" />
                  Manage Bot
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Portfolio Value"
            value="$10,000.00"
            change={3.2}
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatsCard
            title="Trading Profit (30d)"
            value="$3,587.21"
            change={5.8}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Bots"
            value="4"
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Win Rate"
            value="68.2%"
            change={1.4}
            icon={<CircleDollarSign className="h-4 w-4" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <PerformanceChart />
            <TradingPairs />
          </div>
          <div className="space-y-4">
            <BotStatus />
            <TradingSystemInfo />
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
            value="427"
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
          <StatsCard
            title="Days Active"
            value="124"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
