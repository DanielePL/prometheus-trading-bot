
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Cloud, Server } from 'lucide-react';
import { CloudServiceType, CloudConnectionConfig } from './types';
import { getServiceName, getServiceDescription } from './utils';
import { Label } from '@/components/ui/label';

interface DisconnectedStateProps {
  selectedService: CloudServiceType;
  setSelectedService: (service: CloudServiceType) => void;
  connectionConfig: CloudConnectionConfig;
  connectToService: (config?: CloudConnectionConfig) => void;
  isAuthenticated?: boolean;
}

export const DisconnectedState: React.FC<DisconnectedStateProps> = ({
  selectedService,
  setSelectedService,
  connectionConfig,
  connectToService,
  isAuthenticated = false // Keep the prop but ignore its value
}) => {
  const [ipAddress, setIpAddress] = useState(connectionConfig?.ipAddress || '');
  const [port, setPort] = useState(connectionConfig?.port?.toString() || '22');
  const [apiKey, setApiKey] = useState(connectionConfig?.apiKey || '');
  const [instanceId, setInstanceId] = useState(connectionConfig?.instanceId || '');
  const [region, setRegion] = useState(connectionConfig?.region || '');
  
  const handleConnect = () => {
    connectToService({
      ipAddress: ipAddress.trim(),
      port: parseInt(port),
      apiKey: apiKey.trim(),
      instanceId: instanceId.trim(),
      region: region.trim()
    });
  };

  // Always show the connection form, regardless of authentication status
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Cloud Provider</Label>
        <Select 
          value={selectedService} 
          onValueChange={(value) => setSelectedService(value as CloudServiceType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a cloud service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="digitalocean">DigitalOcean Droplet</SelectItem>
            <SelectItem value="aws">AWS EC2</SelectItem>
            <SelectItem value="gcp">Google Cloud Compute</SelectItem>
            <SelectItem value="railway">Railway.app</SelectItem>
            <SelectItem value="azure">Azure VM</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{getServiceDescription(selectedService)}</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">API Key / Access Token</Label>
        <Input 
          type="password" 
          placeholder="Enter DigitalOcean API key" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Your Digital Ocean API key with read/write permissions</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Droplet ID</Label>
        <Input 
          type="text" 
          placeholder="Enter Droplet ID" 
          value={instanceId}
          onChange={(e) => setInstanceId(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">The ID of your Digital Ocean Droplet (found in Droplet settings)</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Region</Label>
        <Input 
          type="text" 
          placeholder="E.g., nyc1, sfo2, etc." 
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Your Droplet's region code (e.g., nyc1, sfo2)</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">IP Address or Hostname</Label>
        <Input 
          type="text" 
          placeholder="Enter IP address (e.g., 123.456.789.0)" 
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">SSH Port</Label>
        <Input 
          type="number" 
          placeholder="Enter port (default: 22)" 
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">The default SSH port is 22, only change if you're using a custom port</p>
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleConnect}
        disabled={!apiKey.trim() || !instanceId.trim()}
      >
        <Server className="mr-2 h-4 w-4" />
        Connect to {getServiceName(selectedService)}
      </Button>
    </div>
  );
};
