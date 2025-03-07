
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarketTable } from '@/components/markets/MarketTable';
import { MarketSearch } from '@/components/markets/MarketSearch';
import { MarketTabs } from '@/components/markets/MarketTabs';
import { EmptyTrackedState } from '@/components/markets/EmptyTrackedState';
import { useMarketData } from '@/hooks/useMarketData';

const Markets = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredMarketData,
    trackedCoins,
    gainers,
    handleTrackToggle
  } = useMarketData();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1">
            Monitor crypto markets and manage your tracked assets
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <MarketTabs />
            <MarketSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <MarketTable 
                  data={filteredMarketData} 
                  handleTrackToggle={handleTrackToggle} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracked" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <MarketTable 
                  data={trackedCoins} 
                  handleTrackToggle={handleTrackToggle} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gainers" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <MarketTable 
                  data={gainers} 
                  handleTrackToggle={handleTrackToggle} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Markets;
