
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SupabaseConnectionTest } from '@/components/dashboard/SupabaseConnectionTest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudConnectionCard } from '@/components/dashboard/cloud-connection/CloudConnectionCard';
import { Database, Cloud, Globe } from 'lucide-react';

const Connections = () => {
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
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Exchange connection tests will be added soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Connections;
