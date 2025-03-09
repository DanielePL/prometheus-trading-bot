
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarketTable } from '@/components/markets/MarketTable';
import { MarketSearch } from '@/components/markets/MarketSearch';
import { MarketTabs } from '@/components/markets/MarketTabs';
import { EmptyTrackedState } from '@/components/markets/EmptyTrackedState';
import { useMarketData } from '@/hooks/useMarketData';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, WifiOff, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConnectionStatusPanel } from '@/components/trading/ConnectionStatusPanel';
import { useToast } from '@/hooks/use-toast';

const Markets = () => {
  const { toast } = useToast();
  const {
    searchTerm,
    setSearchTerm,
    filteredMarketData,
    trackedCoins,
    gainers,
    handleTrackToggle,
    isLoading,
    isUsingLiveData,
    refreshData,
    connectionError,
    retryConnection
  } = useMarketData();
  
  // Get persisted connection information
  const lastConnected = localStorage.getItem('krakenLastConnected');
  const connectionStatus = localStorage.getItem('krakenConnectionStatus');
  const connectionTime = lastConnected ? new Date(lastConnected) : null;
  const timeSinceLastConnection = connectionTime ? Math.floor((Date.now() - connectionTime.getTime()) / 1000) : 0;
  
  const handleRetryConnection = () => {
    toast({
      title: "Reconnecting to Kraken API",
      description: "Attempting to establish connection...",
    });
    retryConnection();
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1">
            Monitor crypto markets and manage your tracked assets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
              
              {connectionError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connection error: {connectionError}
                  </AlertDescription>
                </Alert>
              )}
              
              {isUsingLiveData ? (
                <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Displaying live market data from Kraken API
                    {connectionTime && ` (Connected ${timeSinceLastConnection < 60 
                      ? `${timeSinceLastConnection} seconds ago` 
                      : `${Math.floor(timeSinceLastConnection / 60)} minutes ago`})`}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="mb-4">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    Using demonstration data. {connectionError ? `Connection failed: ${connectionError}` : 'Connect to Kraken API for live data.'}
                  </AlertDescription>
                </Alert>
              )}

              {filteredMarketData.length === 0 && !isLoading && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No market data found. {isUsingLiveData ? 'Try refreshing the data.' : 'Try connecting to the Kraken API.'}
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
          
          <div>
            <ConnectionStatusPanel
              isConnected={isUsingLiveData}
              exchangeName="Kraken"
              apiEndpoint={localStorage.getItem('apiEndpoint') || 'Using CORS proxy'}
              lastPing={isUsingLiveData ? (connectionTime ? Math.min(timeSinceLastConnection, 30) : 24) : 0}
              connectionQuality={isUsingLiveData ? (connectionTime && timeSinceLastConnection < 60 ? 98 : 85) : 0}
              onReconnect={handleRetryConnection}
              onDisconnect={() => window.location.reload()}
              onTest={refreshData}
            />
            
            {!isUsingLiveData && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Connection Required</CardTitle>
                  <CardDescription>
                    {connectionError 
                      ? "Connection failed - see error details below" 
                      : "Set up API keys to view real market data"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {connectionError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {connectionError}
                      </AlertDescription>
                    </Alert>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {connectionError 
                      ? "The connection to Kraken API failed. You can try again or configure your API keys."
                      : "To use live market data, you need to configure your Kraken API keys. Go to the Trading Bot page and click \"Configure API Keys\" to set them up."}
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={handleRetryConnection}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = '/tradingbot'}
                    >
                      Configure API Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Markets;
