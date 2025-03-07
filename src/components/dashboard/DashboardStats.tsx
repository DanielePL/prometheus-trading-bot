
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BullRunIndicator } from '@/components/trading/indicators/BullRunIndicator';
import { Wallet, TrendingUp, CircleDollarSign, Landmark, ClipboardCheck, Calendar } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Top row: 3 stats (half width each) + Bull Run Scanner */}
        <div className="col-span-1">
          <StatsCard
            title="Portfolio Value"
            value="$10,000.00"
            change={0}
            icon={<Wallet className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Trading Profit (30d)"
            value="$0.00"
            change={0}
            icon={<TrendingUp className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Win Rate"
            value="0.0%"
            change={0}
            icon={<CircleDollarSign className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          <BullRunIndicator 
            isBullRun={true}
            confidence={0.85}
            lastDetected="Just now"
            stopLossPercentage={3.5}
          />
        </div>
      </div>
      
      {/* Bottom row: 3 stats (full width each) */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <StatsCard
            title="Total Balance"
            value="$10,000.00"
            icon={<Landmark className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Total Trades"
            value="0"
            icon={<ClipboardCheck className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Days Active"
            value="0"
            icon={<Calendar className="h-4 w-4" />}
            className="bg-[#121625] border-[#1E233A] text-white"
          />
        </div>
        <div className="col-span-1">
          {/* Empty column to align with Bull Run Scanner */}
        </div>
      </div>
    </div>
  );
};
