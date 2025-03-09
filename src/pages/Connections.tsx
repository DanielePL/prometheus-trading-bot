
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SupabaseConnectionTest } from '@/components/dashboard/SupabaseConnectionTest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudConnectionCard } from '@/components/dashboard/cloud-connection/CloudConnectionCard';
import { Database, Cloud, Globe, Plus } from 'lucide-react';
import { ConnectionStatusPanel } from '@/components/trading/ConnectionStatusPanel';
import { ApiKeyConfig } from '@/components/trading/ApiKeyConfig';
import { useTradingBot } from '@/hooks/useTradingBot';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Connections = () => {
  const [state, actions] = useTradingBot();
  const { toast } = useToast();
  const [activeExchange, setActiveExchange] = useState(state.exchangeName);
  const [showAddExchange, setShowAddExchange] = useState(false);
  
  const handleReconnect = () => {
    actions.reconnectExchange();
    toast({
      title: "Reconnecting to Exchange",
      description: `Attempting to connect to ${state.exchangeName}...`
    });
  };
  
  const handleDisconnect = () => {
    actions.disconnectExchange();
    toast({
      title: "Exchange Disconnected",
      description: `Connection to ${state.exchangeName} terminated`
    });
  };
  
  const handleTestConnection = () => {
    actions.testExchangeConnection();
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${state.exchangeName}...`
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Connections</h1>
          <p className="text-muted-foreground mt-2">
            Manage and test connections to external services and APIs.
          </p>
        </div>
        
        <Tabs defaultValue="database">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Cloud Services
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Exchanges
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-4">
            <SupabaseConnectionTest />
          </TabsContent>
          
          <TabsContent value="cloud" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Cloud Service Connections
                </CardTitle>
                <CardDescription>
                  Configure and test connections to cloud providers like AWS, Digital Ocean, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CloudConnectionCard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exchanges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Exchange Connections
                </CardTitle>
                <CardDescription>
                  Configure and test connections to cryptocurrency exchanges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Current Exchange: {state.exchangeName}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowAddExchange(!showAddExchange)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Exchange
                  </Button>
                </div>
                
                {showAddExchange && (
                  <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                    <h4 className="font-medium">Add New Exchange</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure a new exchange connection. The system currently supports Kraken and Binance APIs.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          actions.setShowApiConfig(true);
                          setShowAddExchange(false);
                          toast({
                            title: "Configure Kraken",
                            description: "Enter your Kraken API credentials"
                          });
                        }}
                      >
                        Configure Kraken
                      </Button>
                      <Button 
                        variant="outline" 
                        disabled
                        title="Coming soon"
                      >
                        Configure Binance
                      </Button>
                    </div>
                  </div>
                )}
                
                <ConnectionStatusPanel
                  isConnected={state.isExchangeConnected}
                  exchangeName={state.exchangeName}
                  apiEndpoint={state.apiKeys.apiEndpoint}
                  lastPing={state.exchangeLatency}
                  connectionQuality={state.connectionQuality}
                  onReconnect={handleReconnect}
                  onDisconnect={handleDisconnect}
                  onTest={handleTestConnection}
                />
                
                {state.showApiConfig && (
                  <ApiKeyConfig
                    apiKeys={state.apiKeys}
                    onSave={actions.handleSaveApiKeys}
                    onCancel={() => actions.setShowApiConfig(false)}
                  />
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={() => actions.setShowApiConfig(true)}
                    className="text-sm text-primary underline"
                  >
                    Configure API Keys
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Connections;
