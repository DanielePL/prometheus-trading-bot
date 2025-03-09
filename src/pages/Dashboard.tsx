
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { SettingsDrawer } from '@/components/dashboard/SettingsDrawer';
import { SupabaseIntegrationGuide } from '@/components/dashboard/SupabaseIntegrationGuide';
import { SupabaseConnectionTest } from '@/components/dashboard/SupabaseConnectionTest';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { Button } from '@/components/ui/button';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { TradingSystemInfo } from '@/components/dashboard/TradingSystemInfo';
import { BarChart3 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState("BTC-USD");
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <DashboardHeader
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
        />
        
        <DashboardStats />
        
        <DashboardCharts 
          activeSymbol={activeSymbol}
          setActiveSymbol={setActiveSymbol}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SupabaseConnectionTest />
          <SupabaseIntegrationGuide />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <RecentTrades />
        </div>
        
        <SettingsDrawer />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
