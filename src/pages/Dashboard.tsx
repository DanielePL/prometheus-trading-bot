
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { SettingsDrawer } from '@/components/dashboard/SettingsDrawer';
import { SupabaseIntegrationGuide } from '@/components/dashboard/SupabaseIntegrationGuide';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { Button } from '@/components/ui/button';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { TradingSystemInfo } from '@/components/dashboard/TradingSystemInfo';
import { BarChart3, Link } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Link as RouterLink } from 'react-router-dom';

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
          <SupabaseIntegrationGuide />
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Service Connections
            </h3>
            <p className="text-muted-foreground mb-4">
              Test and manage connections to databases, cloud services, and exchanges.
            </p>
            <Button variant="outline" asChild>
              <RouterLink to="/connections">
                View Connections
              </RouterLink>
            </Button>
          </div>
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
