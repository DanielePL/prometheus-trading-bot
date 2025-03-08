
import { CloudServiceType, ConnectionStatusType } from './types';

export const getServiceName = (serviceType: CloudServiceType): string => {
  switch (serviceType) {
    case 'aws': return 'AWS EC2';
    case 'digitalocean': return 'DigitalOcean Droplet';
    case 'gcp': return 'Google Cloud';
    case 'railway': return 'Railway.app';
    case 'azure': return 'Azure VM';
    default: return 'Cloud Service';
  }
};

export const getServiceDescription = (serviceType: CloudServiceType): string => {
  switch (serviceType) {
    case 'aws': 
      return 'Amazon EC2 instances for cloud compute with scalable capacity';
    case 'digitalocean': 
      return 'Simple virtual machines with SSD and predictable pricing';
    case 'gcp': 
      return 'Google Cloud compute with advanced AI capabilities';
    case 'railway': 
      return 'Developer platform for deploying apps with minimal configuration';
    case 'azure': 
      return 'Microsoft cloud computing service for building and managing applications';
    default: 
      return 'Connect to your cloud service provider';
  }
};

export const getStatusBadgeClass = (status: ConnectionStatusType): string => {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'connecting':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'disconnected':
    default:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }
};
