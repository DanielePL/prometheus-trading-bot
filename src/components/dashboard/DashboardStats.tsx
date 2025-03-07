
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BullRunIndicator } from '@/components/trading/indicators/BullRunIndicator';
import { 
  Wallet, 
  TrendingUp, 
  CircleDollarSign, 
  Landmark, 
  ClipboardCheck, 
  Calendar 
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Top row: 3 stats (1/3 width each) + Bull Run Scanner */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1">
          <StatsCard
            title="Portfolio Value"
            value="$10,000.00"
            change={0}
            icon={<Wallet className="h-4 w-4 text-blue-400" />}
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Trading Profit (30d)"
            value="$0.00"
            change={0}
            icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Win Rate"
            value="0.0%"
            change={0}
            icon={<CircleDollarSign className="h-4 w-4 text-blue-400" />}
          />
        </div>
        <div className="col-span-1 row-span-2">
          <BullRunIndicator 
            isBullRun={true}
            confidence={0.85}
            lastDetected="Just now"
            stopLossPercentage={3.5}
            symbol="BTC-USD"
          />
        </div>
      </div>
      
      {/* Bottom row: 3 stats (1/3 width each) */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1">
          <StatsCard
            title="Total Balance"
            value="$10,000.00"
            icon={<Landmark className="h-4 w-4 text-blue-400" />}
            minimal={true}
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Total Trades"
            value="0"
            icon={<ClipboardCheck className="h-4 w-4 text-blue-400" />}
            minimal={true}
          />
        </div>
        <div className="col-span-1">
          <StatsCard
            title="Days Active"
            value="0"
            icon={<Calendar className="h-4 w-4 text-blue-400" />}
            minimal={true}
          />
        </div>
        {/* The 4th column is taken by the Bull Run Scanner from the row above */}
      </div>
    </div>
  );
};
