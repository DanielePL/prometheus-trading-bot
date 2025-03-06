
export type CloudServiceType = 'aws' | 'digitalocean' | 'gcp' | 'railway';
export type ConnectionStatusType = 'connected' | 'disconnected' | 'connecting';

export interface CloudServiceInfo {
  id: CloudServiceType;
  name: string;
}
