
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cloud } from 'lucide-react';
import { CloudServiceType } from './types';

interface DisconnectedStateProps {
  selectedService: CloudServiceType;
  setSelectedService: (service: CloudServiceType) => void;
  connectToService: () => void;
}

export const DisconnectedState: React.FC<DisconnectedStateProps> = ({
  selectedService,
  setSelectedService,
  connectToService
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Cloud Service</label>
        <Select 
          value={selectedService} 
          onValueChange={(value) => setSelectedService(value as CloudServiceType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a cloud service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">AWS EC2</SelectItem>
            <SelectItem value="digitalocean">DigitalOcean Droplet</SelectItem>
            <SelectItem value="gcp">Google Cloud Compute</SelectItem>
            <SelectItem value="railway">Railway.app</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        className="w-full" 
        onClick={connectToService}
      >
        <Cloud className="mr-2 h-4 w-4" />
        Connect to Cloud Service
      </Button>
    </div>
  );
};
