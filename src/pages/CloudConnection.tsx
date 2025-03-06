
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CloudConnection } from '@/components/dashboard/cloud-connection';
import { 
  CloudCog, 
  CloudDownload, 
  CloudUpload, 
  Server, 
  Shield, 
  Wifi, 
  Globe 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CloudConnectionPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloud Connection</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Prometheus trading bot cloud connections and infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <CloudConnection />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudCog className="h-5 w-5 text-primary" />
                <span>Configuration</span>
              </CardTitle>
              <CardDescription>
                Cloud service configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure your cloud service parameters, security settings, and connection options.
                Set up auto-scaling, backups, and monitoring preferences.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <span>Infrastructure</span>
              </CardTitle>
              <CardDescription>
                Cloud resources management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your cloud resources including compute instances, storage solutions,
                and network configurations for optimal trading performance.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Cloud security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure security policies, access controls, encryption settings,
                and compliance features for your trading bot infrastructure.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudDownload className="h-5 w-5 text-primary" />
                <span>Data Transfer</span>
              </CardTitle>
              <CardDescription>
                Import/Export trading data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transfer trading data between your local environment and cloud infrastructure.
                Schedule regular backups and implement disaster recovery protocols.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                <span>Connectivity</span>
              </CardTitle>
              <CardDescription>
                Network configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure network settings, VPN connections, IP whitelisting,
                and API endpoint access for secure trading operations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Regions</span>
              </CardTitle>
              <CardDescription>
                Geographic deployment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Deploy your trading infrastructure in various geographic regions
                to minimize latency and optimize market access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CloudConnectionPage;
