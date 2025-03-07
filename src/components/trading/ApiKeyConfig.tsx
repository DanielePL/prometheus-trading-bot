
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, X, Save, AlertCircle, ExternalLink } from 'lucide-react';

interface ApiKeyConfigProps {
  apiKeys: {
    exchangeApiKey: string;
    exchangeApiSecret: string;
    apiEndpoint: string;
  };
  onSave: (apiKeys: ApiKeyConfigProps['apiKeys']) => void;
  onCancel: () => void;
}

export const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({
  apiKeys,
  onSave,
  onCancel
}) => {
  const [keys, setKeys] = useState(apiKeys);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openKrakenAPIPage = () => {
    window.open('https://www.kraken.com/u/security/api', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Kraken API Configuration</CardTitle>
                <CardDescription>Configure your Kraken API keys</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Security Notice</p>
                <p>API keys are stored locally in your browser. For production use, consider a more secure storage solution.</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={openKrakenAPIPage}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Kraken API Management
          </Button>

          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              name="apiEndpoint"
              placeholder="https://api.kraken.com"
              value={keys.apiEndpoint}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">Default: https://api.kraken.com</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exchangeApiKey">API Key</Label>
            <Input
              id="exchangeApiKey"
              name="exchangeApiKey"
              placeholder="Your Kraken API key"
              value={keys.exchangeApiKey}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exchangeApiSecret">API Secret</Label>
            <Input
              id="exchangeApiSecret"
              name="exchangeApiSecret"
              type="password"
              placeholder="Your Kraken API secret"
              value={keys.exchangeApiSecret}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(keys)}>
            <Save className="mr-2 h-4 w-4" />
            Save API Keys
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
