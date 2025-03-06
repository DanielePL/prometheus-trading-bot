
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
  connectToService: (config?: CloudConnectionConfig) => void;
}

export const DisconnectedState: React.FC<DisconnectedStateProps> = ({
  selectedService,
  setSelectedService,
  connectToService
}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('22');
  const [apiKey, setApiKey] = useState('');
  
  const handleConnect = () => {
    connectToService({
      ipAddress: ipAddress.trim(),
      port: parseInt(port),
      apiKey: apiKey.trim()
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Select Cloud Service</Label>
        <Select 
          value={selectedService} 
          onValueChange={(value) => setSelectedService(value as CloudServiceType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a cloud service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">AWS EC2</SelectItem>
            <SelectItem value="digitalocean">DigitalOcean Droplet</SelectItem>
            <SelectItem value="gcp">Google Cloud Compute</SelectItem>
            <SelectItem value="railway">Railway.app</SelectItem>
            <SelectItem value="azure">Azure VM</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{getServiceDescription(selectedService)}</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">IP Address</Label>
        <Input 
          type="text" 
          placeholder="Enter IP address" 
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Port</Label>
        <Input 
          type="number" 
          placeholder="Enter port" 
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">API Key (if required)</Label>
        <Input 
          type="password" 
          placeholder="Enter API key" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleConnect}
        disabled={!ipAddress.trim()}
      >
        <Server className="mr-2 h-4 w-4" />
        Connect to {getServiceName(selectedService)}
      </Button>
    </div>
  );
};
