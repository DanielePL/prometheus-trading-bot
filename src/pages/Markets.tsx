
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarketTable } from '@/components/markets/MarketTable';
import { MarketSearch } from '@/components/markets/MarketSearch';
import { MarketTabs } from '@/components/markets/MarketTabs';
import { EmptyTrackedState } from '@/components/markets/EmptyTrackedState';
import { useMarketData } from '@/hooks/useMarketData';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Markets = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredMarketData,
    trackedCoins,
    gainers,
    handleTrackToggle,
    isLoading,
    isUsingLiveData,
    refreshData
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={isLoading || !isUsingLiveData}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <MarketSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          
          {isUsingLiveData ? (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Displaying live market data from Kraken API
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Using demonstration data. Connect to Kraken API for live data.
              </AlertDescription>
            </Alert>
          )}
          
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
                {trackedCoins.length > 0 ? (
                  <MarketTable 
                    data={trackedCoins} 
                    handleTrackToggle={handleTrackToggle} 
                  />
                ) : (
                  <EmptyTrackedState />
                )}
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
