
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { MarketDepthVisualization } from '@/components/markets/MarketDepthVisualization';
import { TradingPairs } from '@/components/dashboard/TradingPairs';
import { BotStatus } from '@/components/dashboard/BotStatus';
import { TradingSystemInfo } from '@/components/dashboard/TradingSystemInfo';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';

interface DashboardChartsProps {
  activeSymbol: string;
  setActiveSymbol: React.Dispatch<React.SetStateAction<string>>;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  activeSymbol, 
  setActiveSymbol 
}) => {
  const handleSymbolChange = (symbol: string) => {
    setActiveSymbol(symbol);
  };
  
  return (
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
            <TradingPairs onSelectSymbol={handleSymbolChange} />
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
  );
};
