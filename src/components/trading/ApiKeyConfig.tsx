
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, X, Save, AlertCircle, ExternalLink, Eye, EyeOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Test API credentials - FOR TESTING PURPOSES ONLY
const TEST_API_KEY = 'p1XiHHWQiJzxpZpeXj5I52pMiJVsBGzyYVF7KqMz13cGKv0gjJCIhpDN';
const TEST_API_SECRET = 'yB5FRqbIwOqyzUoxtkdHHCqSnk8N8vfmGeRnBJwItmUHAVLuNtsYic1f1u1U3qOIxHDxjIlvzl0TPCPZCC7s9Q==';
const TEST_API_ENDPOINT = 'https://cors-proxy.fringe.zone/https://api.kraken.com';
const FALLBACK_API_ENDPOINT = 'https://demo-futures.kraken.com/derivatives';

// The correct path for public API endpoints
const PUBLIC_API_PATH = '/0/public/';

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
  const { toast } = useToast();
  const [keys, setKeys] = useState({
    exchangeApiKey: TEST_API_KEY,
    exchangeApiSecret: TEST_API_SECRET,
    apiEndpoint: TEST_API_ENDPOINT
  });
  const [showSecret, setShowSecret] = useState(false);
  const [savedKeys, setSavedKeys] = useState<{[key: string]: string}>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [useFallbackEndpoint, setUseFallbackEndpoint] = useState(false);

  // Load any previously saved credentials from localStorage on component mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      // Check if we should use the fallback endpoint
      const usingFallback = localStorage.getItem('krakenConnectionStatus') === 'connected_fallback';
      setUseFallbackEndpoint(usingFallback);
      
      // We're using hardcoded test keys, but still check localStorage for compatibility
      const savedApiKey = localStorage.getItem('exchangeApiKey') || TEST_API_KEY;
      const savedApiSecret = localStorage.getItem('exchangeApiSecret') || TEST_API_SECRET;
      const savedApiEndpoint = localStorage.getItem('apiEndpoint') || 
                               (usingFallback ? FALLBACK_API_ENDPOINT : TEST_API_ENDPOINT);
      
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

  const handleEndpointToggle = () => {
    setUseFallbackEndpoint(!useFallbackEndpoint);
    setKeys(prev => ({
      ...prev,
      apiEndpoint: !useFallbackEndpoint ? FALLBACK_API_ENDPOINT : TEST_API_ENDPOINT
    }));
  };

  const openKrakenAPIPage = () => {
    window.open('https://www.kraken.com/u/security/api', '_blank');
  };

  const toggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  const constructApiUrl = (endpoint: string, path: string): string => {
    // Ensure the endpoint doesn't end with a slash and path starts with a slash
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // For the CORS proxy, we need to ensure the target URL is properly encoded
    if (cleanEndpoint.includes('cors-proxy.fringe.zone')) {
      // Extract the target URL from the CORS proxy URL
      const proxyParts = cleanEndpoint.split('/https://');
      if (proxyParts.length >= 2) {
        const proxyBase = proxyParts[0];
        const targetBase = `https://${proxyParts[1]}`;
        
        // Return the properly formatted URL
        return `${proxyBase}/https://${targetBase.replace(/^https:\/\//, '')}${cleanPath}`;
      }
    }
    
    // For regular endpoints or if CORS proxy parsing fails
    return `${cleanEndpoint}${cleanPath}`;
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const endpoint = keys.apiEndpoint;
      console.log(`Testing connection to endpoint: ${endpoint}`);
      
      // Construct the proper URL for the Time API call
      const timeEndpoint = constructApiUrl(endpoint, PUBLIC_API_PATH + 'Time');
      console.log(`Constructed Time API URL: ${timeEndpoint}`);
      
      // Increase timeout for better reliability
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 30000);
      
      // First try a preflight OPTIONS request to check CORS setup
      try {
        console.log(`Sending OPTIONS preflight request to: ${timeEndpoint}`);
        const preflightResponse = await fetch(timeEndpoint, {
          method: 'OPTIONS',
          signal: abortController.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TradingBot/1.0'
          }
        });
        
        console.log(`Preflight response status: ${preflightResponse.status}`);
        // If preflight fails, we'll get an error and jump to the catch block
      } catch (prefError) {
        console.warn(`Preflight request failed: ${prefError instanceof Error ? prefError.message : String(prefError)}`);
        // Continue anyway, as some CORS proxies don't handle OPTIONS properly
      }
      
      // Now try the actual API call
      console.log(`Sending GET request to: ${timeEndpoint}`);
      const response = await fetch(timeEndpoint, {
        signal: abortController.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TradingBot/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        setTestResult({
          success: false,
          message: `HTTP error: ${response.status} ${response.statusText}`
        });
        return;
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
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
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Kraken API"
      });
    } catch (error) {
      let errorMessage = "Connection failed";
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Connection timed out after 30 seconds";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: CORS issue or API endpoint unreachable. Check your browser's console for more details.";
      } else {
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      console.error('Connection test error:', error);
      
      setTestResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
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
    
    // Store fallback status if using fallback
    if (useFallbackEndpoint) {
      localStorage.setItem('krakenConnectionStatus', 'connected_fallback');
    } else {
      localStorage.removeItem('krakenConnectionStatus');
    }
    
    // Reset connection status to force a new connection attempt
    localStorage.removeItem('krakenLastConnected');
    localStorage.removeItem('krakenConnectionError');
    
    // Pass data to parent component
    onSave(keys);
    
    toast({
      title: "API Keys Saved",
      description: "Your API configuration has been saved. The page will refresh to apply changes.",
      duration: 3000,
    });
    
    // Force a page reload to properly initialize with new API keys
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
                <CardDescription>Configure your Kraken API connection</CardDescription>
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
                  Using hardcoded test API keys by default. In production, these would be securely stored.
                  {useFallbackEndpoint && (
                    <strong className="block mt-1">Using fallback endpoint due to connection issues with the primary endpoint.</strong>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-auto" 
              onClick={openKrakenAPIPage}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Kraken API Docs
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-auto" 
              onClick={handleEndpointToggle}
            >
              {useFallbackEndpoint ? "Use Primary Endpoint" : "Try Fallback Endpoint"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              name="apiEndpoint"
              placeholder={TEST_API_ENDPOINT}
              value={keys.apiEndpoint}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              {useFallbackEndpoint 
                ? "Using fallback endpoint for alternative access" 
                : "Using CORS proxy is necessary for browser-based access"}
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
            {keys.exchangeApiKey === TEST_API_KEY && (
              <p className="text-xs text-green-600 dark:text-green-400">Using test API key</p>
            )}
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
            {keys.exchangeApiSecret === TEST_API_SECRET && (
              <p className="text-xs text-green-600 dark:text-green-400">Using test API secret</p>
            )}
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
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
          
          {!testResult && testingConnection && (
            <div className="flex justify-center py-2">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
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
