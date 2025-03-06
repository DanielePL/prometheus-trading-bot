
export type CloudServiceType = 'aws' | 'digitalocean' | 'gcp' | 'railway' | 'azure';
export type ConnectionStatusType = 'connected' | 'disconnected' | 'connecting';

export interface CloudServiceInfo {
  id: CloudServiceType;
  name: string;
  description?: string;
  credentials?: Record<string, string>;
}

export interface CloudConnectionConfig {
  apiKey?: string;
  region?: string;
  instanceId?: string;
  ipAddress?: string;
  port?: number;
}
