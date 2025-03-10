
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

// API endpoints with reliable CORS proxies
const DIRECT_API_ENDPOINT = 'https://api.kraken.com';
const CORS_PROXY_ENDPOINT = 'https://corsproxy.io/?https://api.kraken.com';
const FALLBACK_API_ENDPOINT = 'https://demo-futures.kraken.com/derivatives';

// API paths
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
    apiEndpoint: CORS_PROXY_ENDPOINT // Default to CORS proxy for better browser compatibility
  });
  const [showSecret, setShowSecret] = useState(false);
  const [savedKeys, setSavedKeys] = useState<{[key: string]: string}>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [endpointMode, setEndpointMode] = useState<'direct' | 'cors-proxy' | 'fallback'>('cors-proxy');

  // Load any previously saved credentials from localStorage on component mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      const connectionStatus = localStorage.getItem('krakenConnectionStatus');
      let mode: 'direct' | 'cors-proxy' | 'fallback' = 'cors-proxy'; // Default to CORS proxy
      
      if (connectionStatus === 'connected_direct') {
        mode = 'direct';
      } else if (connectionStatus === 'connected_fallback') {
        mode = 'fallback';
      }
      
      setEndpointMode(mode);
      
      // We're using hardcoded test keys, but still check localStorage for compatibility
      const savedApiKey = localStorage.getItem('exchangeApiKey') || TEST_API_KEY;
      const savedApiSecret = localStorage.getItem('exchangeApiSecret') || TEST_API_SECRET;
      
      // Set endpoint based on mode
      let savedApiEndpoint;
      if (mode === 'cors-proxy') {
        savedApiEndpoint = CORS_PROXY_ENDPOINT;
      } else if (mode === 'fallback') {
        savedApiEndpoint = FALLBACK_API_ENDPOINT;
      } else {
        savedApiEndpoint = DIRECT_API_ENDPOINT;
      }
      
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
    let newMode: 'direct' | 'cors-proxy' | 'fallback';
    let newEndpoint: string;
    
    // Cycle through the connection modes
    if (endpointMode === 'direct') {
      newMode = 'cors-proxy';
      newEndpoint = CORS_PROXY_ENDPOINT;
    } else if (endpointMode === 'cors-proxy') {
      newMode = 'fallback';
      newEndpoint = FALLBACK_API_ENDPOINT;
    } else {
      newMode = 'direct';
      newEndpoint = DIRECT_API_ENDPOINT;
    }
    
    setEndpointMode(newMode);
    setKeys(prev => ({
      ...prev,
      apiEndpoint: newEndpoint
    }));
    
    toast({
      title: "Endpoint Changed",
      description: `Now using ${newMode === 'direct' ? 'direct' : newMode === 'cors-proxy' ? 'CORS proxy' : 'fallback'} endpoint`,
    });
  };

  const openKrakenAPIPage = () => {
    window.open('https://www.kraken.com/u/security/api', '_blank');
  };

  const toggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  // Helper to construct API URLs correctly
  const constructApiUrl = (endpoint: string, path: string): string => {
    if (endpointMode === 'cors-proxy') {
      // For CORS proxy, we need the full URL already encoded in the endpoint
      return endpoint;
    } else if (endpointMode === 'fallback') {
      // Fallback endpoint uses a different API structure
      return `${endpoint}/api/v3/time`;
    } else {
      // Direct endpoint - standard Kraken API
      return `${endpoint}${path}`;
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      console.log(`Testing connection using ${endpointMode} mode`);
      console.log(`API endpoint: ${keys.apiEndpoint}`);
      
      // Use the Time endpoint to test connection
      const apiUrl = constructApiUrl(keys.apiEndpoint, PUBLIC_API_PATH + 'Time');
      console.log(`Making request to: ${apiUrl}`);
      
      // Set up fetch with a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      // Make the request with proper headers
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'TradingBot/1.0'
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response
      const text = await response.text();
      console.log('Raw API response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error(`Failed to parse response as JSON: ${text.substring(0, 100)}...`);
      }
      
      console.log('Parsed API response:', data);
      
      if (data.error && data.error.length > 0) {
        throw new Error(`API error: ${data.error.join(', ')}`);
      }
      
      // Format success message based on response
      let serverTime = 'unknown';
      if (endpointMode === 'fallback') {
        serverTime = new Date(data.timestamp || Date.now()).toLocaleString();
      } else {
        serverTime = new Date((data.result?.unixtime || 0) * 1000).toLocaleString();
      }
      
      const successMessage = `Connection successful! Server time: ${serverTime}`;
      
      setTestResult({
        success: true,
        message: successMessage
      });

      // Store connection status
      localStorage.setItem('krakenConnectionStatus', `connected_${endpointMode}`);
      localStorage.setItem('krakenLastConnected', new Date().toISOString());
      localStorage.removeItem('krakenConnectionError');
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Kraken API"
      });
    } catch (error) {
      console.error('Connection test error:', error);
      
      let errorMessage = "Connection failed";
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Connection timed out after 20 seconds";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: CORS issue or API endpoint unreachable";
        
        // Suggest solutions based on the current mode
        if (endpointMode === 'direct') {
          errorMessage += ". Try using the CORS proxy option.";
        } else if (endpointMode === 'cors-proxy') {
          errorMessage += ". Try the fallback endpoint.";
        } else {
          errorMessage += ". Check your network connection.";
        }
      } else {
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setTestResult({
        success: false,
        message: errorMessage
      });
      
      // Store error in localStorage
      localStorage.setItem('krakenConnectionStatus', 'failed');
      localStorage.setItem('krakenConnectionError', errorMessage);
      
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
    
    // Store connection mode status
    localStorage.setItem('krakenConnectionStatus', `connected_${endpointMode}`);
    
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

  const getEndpointButtonText = () => {
    switch (endpointMode) {
      case 'direct':
        return "Try CORS Proxy";
      case 'cors-proxy':
        return "Try Fallback Endpoint";
      case 'fallback':
        return "Use Direct Endpoint";
      default:
        return "Change Endpoint Mode";
    }
  };

  const getEndpointDescription = () => {
    switch (endpointMode) {
      case 'direct':
        return "Using direct API endpoint - might have CORS issues in browser";
      case 'cors-proxy':
        return "Using CORS proxy to bypass browser restrictions";
      case 'fallback':
        return "Using fallback endpoint for alternative access";
      default:
        return "";
    }
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
                  <strong className="block mt-1">
                    Current mode: {endpointMode === 'direct' ? 'Direct API' : endpointMode === 'cors-proxy' ? 'CORS Proxy' : 'Fallback API'}
                  </strong>
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
              {getEndpointButtonText()}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              name="apiEndpoint"
              value={keys.apiEndpoint}
              onChange={handleChange}
              disabled={true}
            />
            <p className="text-xs text-muted-foreground">
              {getEndpointDescription()}
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
