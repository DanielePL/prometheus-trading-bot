
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BullRunIndicator } from '@/components/trading/indicators/BullRunIndicator';
import { Wallet, TrendingUp, CircleDollarSign, Landmark, ClipboardCheck, Calendar } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  return (
    <>
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
    </>
  );
};
