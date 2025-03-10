import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, X, Save, AlertCircle, ExternalLink, Eye, EyeOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Test API credentials - FOR TESTING PURPOSES ONLY
const TEST_API_KEY = 'p1XiHHWQiJzxpZpeXj5I52pMiJVsBGzyYVF7KqMz13cGKv0gjJCIhpDN
';
const TEST_API_SECRET = 'yB5FRqbIwOqyzUoxtkdHHCqSnk8N8vfmGeRnBJwItmUHAVLuNtsYic1f1u1U3qOIxHDxjIlvzl0TPCPZCC7s9Q==';
// Using direct API endpoint without proxy by default
const TEST_API_ENDPOINT = 'https://api.kraken.com';
// Adding multiple fallback options including a CORS proxy
const CORS_PROXY_ENDPOINT = 'https://corsproxy.io/?';
const FALLBACK_API_ENDPOINT = 'https://demo-futures.kraken.com/derivatives';

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
  const [endpointMode, setEndpointMode] = useState<'direct' | 'cors-proxy' | 'fallback'>('direct');

  // Load any previously saved credentials from localStorage on component mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      const connectionStatus = localStorage.getItem('krakenConnectionStatus');
      let mode: 'direct' | 'cors-proxy' | 'fallback' = 'direct';
      
      if (connectionStatus === 'connected_cors_proxy') {
        mode = 'cors-proxy';
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
        savedApiEndpoint = `${CORS_PROXY_ENDPOINT}${encodeURIComponent(TEST_API_ENDPOINT)}`;
      } else if (mode === 'fallback') {
        savedApiEndpoint = FALLBACK_API_ENDPOINT;
      } else {
        savedApiEndpoint = localStorage.getItem('apiEndpoint') || TEST_API_ENDPOINT;
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
      newEndpoint = `${CORS_PROXY_ENDPOINT}${encodeURIComponent(TEST_API_ENDPOINT)}`;
    } else if (endpointMode === 'cors-proxy') {
      newMode = 'fallback';
      newEndpoint = FALLBACK_API_ENDPOINT;
    } else {
      newMode = 'direct';
      newEndpoint = TEST_API_ENDPOINT;
    }
    
    setEndpointMode(newMode);
    setKeys(prev => ({
      ...prev,
      apiEndpoint: newEndpoint
    }));
  };

  const openKrakenAPIPage = () => {
    window.open('https://www.kraken.com/u/security/api', '_blank');
  };

  const toggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  // Helper to normalize URLs for API requests
  const buildApiUrl = (base: string, path: string): string => {
    // Remove trailing slashes from base
    const cleanBase = base.replace(/\/+$/, '');
    
    // Handle CORS proxy URLs specially
    if (base.includes(CORS_PROXY_ENDPOINT)) {
      // For corsproxy.io, we need to ensure the encoded URL is properly formed
      const encodedApiUrl = encodeURIComponent(`${TEST_API_ENDPOINT}${path}`);
      return `${CORS_PROXY_ENDPOINT}${encodedApiUrl}`;
    }
    
    // Add leading slash to path if needed
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${cleanBase}${cleanPath}`;
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const endpoint = keys.apiEndpoint;
      console.log(`Testing connection to endpoint mode: ${endpointMode}`);
      console.log(`Using endpoint: ${endpoint}`);
      
      // Create the correct URL for the API call
      const apiPath = '/0/public/Time';
      const apiUrl = endpointMode === 'fallback' 
        ? `${endpoint}/api/v3/time` // Different path for fallback endpoint
        : buildApiUrl(endpoint, apiPath);
      
      console.log(`Making request to: ${apiUrl}`);
      
      // Set up fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Omitting credentials to avoid preflight requests
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data.error && data.error.length > 0) {
        throw new Error(`API error: ${data.error.join(', ')}`);
      }
      
      let successMessage = "Connection successful!";
      
      // Format differs between main API and fallback
      if (endpointMode === 'fallback') {
        successMessage += ` Server time: ${new Date(data.result || data.timestamp).toLocaleString()}`;
      } else {
        successMessage += ` Server time: ${new Date((data.result?.unixtime || data.result?.rfc1123) * 1000).toLocaleString()}`;
      }
      
      setTestResult({
        success: true,
        message: successMessage
      });
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Kraken API"
      });
    } catch (error) {
      let errorMessage = "Connection failed";
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Connection timed out after 15 seconds";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: CORS issue or API endpoint unreachable";
        
        // Suggest solutions based on the current mode
        if (endpointMode === 'direct') {
          errorMessage += ". Try using the CORS proxy option.";
        } else if (endpointMode === 'cors-proxy') {
          errorMessage += ". Try using the fallback endpoint or check if the CORS proxy is working.";
        } else {
          errorMessage += ". Try a different API endpoint.";
        }
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
    
    // Store connection mode status
    if (endpointMode === 'cors-proxy') {
      localStorage.setItem('krakenConnectionStatus', 'connected_cors_proxy');
    } else if (endpointMode === 'fallback') {
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
              placeholder={TEST_API_ENDPOINT}
              value={keys.apiEndpoint}
              onChange={handleChange}
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
