
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, X, Save, AlertCircle, ExternalLink, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Test API credentials - FOR TESTING PURPOSES ONLY
// These should match the ones in KrakenMarketService.ts
const TEST_API_KEY = 'p1XiHHWQiJzxpZpeXj5I52pMiJVsBGzyYVF7KqMz13cGKv0gjJCIhpDN';
const TEST_API_SECRET = 'yB5FRqbIwOqyzUoxtkdHHCqSnk8N8vfmGeRnBJwItmUHAVLuNtsYic1f1u1U3qOIxHDxjIlvzl0TPCPZCC7s9Q==';
const TEST_API_ENDPOINT = 'https://cors-proxy.fringe.zone/https://api.kraken.com';

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
  const [keys, setKeys] = useState({
    exchangeApiKey: TEST_API_KEY,
    exchangeApiSecret: TEST_API_SECRET,
    apiEndpoint: TEST_API_ENDPOINT
  });
  const [showSecret, setShowSecret] = useState(false);
  const [savedKeys, setSavedKeys] = useState<{[key: string]: string}>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  // Load any previously saved credentials from localStorage on component mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      // We're using hardcoded test keys, but still check localStorage for compatibility
      const savedApiKey = localStorage.getItem('exchangeApiKey') || TEST_API_KEY;
      const savedApiSecret = localStorage.getItem('exchangeApiSecret') || TEST_API_SECRET;
      const savedApiEndpoint = localStorage.getItem('apiEndpoint') || TEST_API_ENDPOINT;
      
      const savedData: {[key: string]: string} = {};
      if (savedApiKey) savedData.exchangeApiKey = savedApiKey;
      if (savedApiSecret) savedData.exchangeApiSecret = savedApiSecret;
      if (savedApiEndpoint) savedData.apiEndpoint = savedApiEndpoint;
      
      setSavedKeys(savedData);
      
      // Set the keys from saved values or defaults
      setKeys({
        exchangeApiKey: savedApiKey,
        exchangeApiSecret: savedApiSecret,
        apiEndpoint: savedApiEndpoint
      });
    };
    
    loadSavedCredentials();
  }, []);

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

  const toggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15000);
      
      const response = await fetch(`${keys.apiEndpoint}/0/public/Time`, {
        signal: abortController.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TradingBot/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        setTestResult({
          success: false,
          message: `HTTP error: ${response.status} ${response.statusText}`
        });
        return;
      }
      
      const data = await response.json();
      if (data.error && data.error.length > 0) {
        setTestResult({
          success: false,
          message: `API error: ${data.error.join(', ')}`
        });
        return;
      }
      
      setTestResult({
        success: true,
        message: `Connection successful! Server time: ${new Date(data.result.unixtime * 1000).toLocaleString()}`
      });
    } catch (error) {
      let errorMessage = "Connection failed";
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Connection timed out after 15 seconds";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: CORS issue or API endpoint unreachable";
      } else {
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setTestResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    if (keys.exchangeApiKey) {
      localStorage.setItem('exchangeApiKey', keys.exchangeApiKey);
    }
    
    if (keys.exchangeApiSecret) {
      localStorage.setItem('exchangeApiSecret', keys.exchangeApiSecret);
    }
    
    if (keys.apiEndpoint) {
      localStorage.setItem('apiEndpoint', keys.apiEndpoint);
    }
    
    // Reset connection status to force a new connection attempt
    localStorage.removeItem('krakenConnectionStatus');
    localStorage.removeItem('krakenLastConnected');
    localStorage.removeItem('krakenConnectionError');
    
    // Pass data to parent component
    onSave(keys);
    
    // Force a page reload to properly initialize with new API keys
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Kraken API Configuration (TEST MODE)</CardTitle>
                <CardDescription>Using test API keys - for development only</CardDescription>
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
                <p className="font-medium">Test Environment Notice</p>
                <p>
                  Using hardcoded test API keys. In production, these would be securely stored.
                  If your API connection is failing, try using the "Test Connection" button below to diagnose issues.
                </p>
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
              placeholder="https://cors-proxy.fringe.zone/https://api.kraken.com"
              value={keys.apiEndpoint}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Using CORS proxy is necessary for browser-based access. Default: {TEST_API_ENDPOINT}
            </p>
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
            <p className="text-xs text-green-600 dark:text-green-400">Using test API key</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exchangeApiSecret">API Secret</Label>
            <div className="relative">
              <Input
                id="exchangeApiSecret"
                name="exchangeApiSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Your Kraken API secret"
                value={keys.exchangeApiSecret}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1"
                onClick={toggleShowSecret}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Using test API secret</p>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={testConnection}
            disabled={testingConnection}
          >
            {testingConnection ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
          
          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <AlertDescription>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save API Keys
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
