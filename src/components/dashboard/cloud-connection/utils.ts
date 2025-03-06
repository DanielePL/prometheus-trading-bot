
import { CloudServiceType } from './types';

export const getServiceName = (serviceId: CloudServiceType): string => {
  switch (serviceId) {
    case 'aws': return 'AWS EC2';
    case 'digitalocean': return 'DigitalOcean Droplet';
    case 'gcp': return 'Google Cloud Compute';
    case 'railway': return 'Railway.app';
    default: return 'Cloud Service';
  }
};

export const getStatusBadgeClass = (status: 'connected' | 'disconnected' | 'connecting'): string => {
  switch (status) {
    case 'connected': 
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case 'disconnected': 
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case 'connecting': 
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "";
  }
};
