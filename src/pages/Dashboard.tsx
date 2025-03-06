
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TradingPairs } from '@/components/dashboard/TradingPairs';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { 
  Wallet, TrendingUp, BarChart2, CircleDollarSign, 
  Landmark, ClipboardCheck, Calendar
} from 'lucide-react';

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your trading bot performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Portfolio Value"
            value="$128,459.32"
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
            <RecentTrades />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Balance"
            value="$145,289.57"
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
