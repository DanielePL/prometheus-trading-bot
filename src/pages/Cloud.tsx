
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CloudConnection } from '@/components/dashboard/CloudConnection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Server, Database, HardDrive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CloudPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloud Management</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage your cloud infrastructure for Prometheus trading system.
          </p>
        </div>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="connection">
              <Cloud className="h-4 w-4 mr-2" />
              Cloud Connection
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Server className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="backups">
              <Database className="h-4 w-4 mr-2" />
              Backups
            </TabsTrigger>
            <TabsTrigger value="logs">
              <HardDrive className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <CloudConnection />
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Guide</CardTitle>
                <CardDescription>
                  How to set up your cloud infrastructure for Prometheus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Step 1: Create a DigitalOcean Droplet</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign up for DigitalOcean and create a new Droplet (their name for a cloud server).
                    Recommended specs: 2GB RAM / 1 CPU / 50GB SSD ($12/month).
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Step 2: Generate API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    In your DigitalOcean account, go to API → Generate New Token to create an API key with read and write permissions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Step 3: Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your Droplet's IP address (found in the DigitalOcean dashboard), default port (22),
                    and the API key you generated in the Cloud Connection card above.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Step 4: Install Trading System</h3>
                  <p className="text-sm text-muted-foreground">
                    After connecting, the system will automatically install Docker and set up the
                    Prometheus trading system containers on your cloud server.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>
                  View and manage your cloud resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-8 text-center">
                  Connect to your cloud provider to manage resources
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Backup Management</CardTitle>
                <CardDescription>
                  Configure automated backups of your trading data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-8 text-center">
                  Connect to your cloud provider to manage backups
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  View system logs and diagnostics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-8 text-center">
                  Connect to your cloud provider to view logs
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CloudPage;
