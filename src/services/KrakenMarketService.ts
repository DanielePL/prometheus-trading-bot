import { MarketData } from '@/types/market';
import { KrakenAPI } from '@/components/trading/KrakenAPI';

// API endpoints with reliable CORS proxies
const DIRECT_API_ENDPOINT = 'https://api.kraken.com';
const CORS_PROXY_ENDPOINT = 'https://corsproxy.io/?https://api.kraken.com';
const FALLBACK_API_ENDPOINT = 'https://demo-futures.kraken.com/derivatives';

// Test API credentials - FOR TESTING PURPOSES ONLY
const TEST_API_KEY = 'p1XiHHWQiJzxpZpeXj5I52pMiJVsBGzyYVF7KqMz13cGKv0gjJCIhpDN';
const TEST_API_SECRET = 'yB5FRqbIwOqyzUoxtkdHHCqSnk8N8vfmGeRnBJwItmUHAVLuNtsYic1f1u1U3qOIxHDxjIlvzl0TPCPZCC7s9Q==';

export class KrakenMarketService {
  private api: KrakenAPI;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private connectionAttempted: boolean = false;
  private usingFallbackEndpoint: boolean = false;
  private usingCorsProxy: boolean = false;

  constructor() {
    // Check localStorage for previously saved connection info
    const connectionStatus = localStorage.getItem('krakenConnectionStatus');
    const savedApiKey = localStorage.getItem('exchangeApiKey') || TEST_API_KEY;
    const savedApiSecret = localStorage.getItem('exchangeApiSecret') || TEST_API_SECRET;
    
    // Determine which endpoint to use
    let apiEndpoint = CORS_PROXY_ENDPOINT; // Default to CORS proxy
    this.usingCorsProxy = true;
    
    if (connectionStatus === 'connected_direct') {
      apiEndpoint = DIRECT_API_ENDPOINT;
      this.usingCorsProxy = false;
    } else if (connectionStatus === 'connected_fallback') {
      apiEndpoint = FALLBACK_API_ENDPOINT;
      this.usingFallbackEndpoint = true;
      this.usingCorsProxy = false;
    } else if (connectionStatus === 'connected_cors_proxy') {
      apiEndpoint = CORS_PROXY_ENDPOINT;
      this.usingCorsProxy = true;
    }
    
    // Override with localStorage value if exists
    const savedEndpoint = localStorage.getItem('apiEndpoint');
    if (savedEndpoint) {
      apiEndpoint = savedEndpoint;
    }
    
    console.log('Initializing KrakenMarketService with endpoint:', apiEndpoint);
    
    // Initialize the Kraken API
    this.api = new KrakenAPI(savedApiKey, savedApiSecret, apiEndpoint);
  }

  private async testConnection(): Promise<void> {
    if (this.connectionAttempted) return;
    
    this.connectionAttempted = true;
    console.log('Testing connection to Kraken API...');
    
    try {
      const result = await this.api.testConnectionWithDetails();
      this.isConnected = result.success;
      this.connectionError = result.success ? null : result.message;
      console.log(`Kraken market service connection: ${result.success ? 'connected' : 'failed'}, message: ${result.message}`);
      
      // If connection failed and we're not already using the fallback, try the fallback
      if (!result.success && !this.usingFallbackEndpoint) {
        console.log('Attempting to use fallback API endpoint...');
        await this.tryFallbackEndpoint();
        return;
      }
      
      // Store connection status in localStorage for persistence
      if (result.success) {
        localStorage.setItem('krakenConnectionStatus', 'connected');
        localStorage.setItem('krakenLastConnected', new Date().toISOString());
        localStorage.removeItem('krakenConnectionError');
      } else {
        localStorage.setItem('krakenConnectionStatus', 'failed');
        localStorage.setItem('krakenConnectionError', result.message);
      }
    } catch (error) {
      console.error('Kraken market service connection error:', error);
      this.isConnected = false;
      this.connectionError = error instanceof Error ? error.message : String(error);
      
      // Try fallback endpoint if we're not already using it
      if (!this.usingFallbackEndpoint) {
        console.log('Connection error caught, attempting to use fallback API endpoint...');
        await this.tryFallbackEndpoint();
        return;
      }
      
      // Store connection error in localStorage
      localStorage.setItem('krakenConnectionStatus', 'failed');
      localStorage.setItem('krakenConnectionError', this.connectionError);
    }
  }

  private async tryFallbackEndpoint(): Promise<void> {
    try {
      console.log('Switching to fallback API endpoint...');
      this.usingFallbackEndpoint = true;
      
      // Get the current API key and secret
      const apiKey = localStorage.getItem('exchangeApiKey') || '';
      const apiSecret = localStorage.getItem('exchangeApiSecret') || '';
      
      // Create a new API instance with the fallback endpoint
      this.api = new KrakenAPI(apiKey, apiSecret, FALLBACK_API_ENDPOINT);
      
      // Test the connection with the fallback endpoint
      const result = await this.api.testConnectionWithDetails();
      this.isConnected = result.success;
      this.connectionError = result.success ? null : `Fallback connection: ${result.message}`;
      
      console.log(`Fallback connection: ${result.success ? 'connected' : 'failed'}, message: ${result.message}`);
      
      // Store connection status in localStorage
      if (result.success) {
        localStorage.setItem('krakenConnectionStatus', 'connected_fallback');
        localStorage.setItem('krakenLastConnected', new Date().toISOString());
        localStorage.setItem('apiEndpoint', FALLBACK_API_ENDPOINT);
      } else {
        localStorage.setItem('krakenConnectionStatus', 'failed');
        localStorage.setItem('krakenConnectionError', `Primary and fallback connection failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Fallback connection error:', error);
      this.isConnected = false;
      this.connectionError = `Both primary and fallback connections failed: ${error instanceof Error ? error.message : String(error)}`;
      
      // Store connection error in localStorage
      localStorage.setItem('krakenConnectionStatus', 'failed');
      localStorage.setItem('krakenConnectionError', this.connectionError);
    }
  }

  public async resetConnection(): Promise<boolean> {
    this.connectionAttempted = false;
    this.isConnected = false;
    this.connectionError = null;
    this.usingFallbackEndpoint = false;
    
    // Reset to the default endpoint or stored endpoint
    const apiKey = localStorage.getItem('exchangeApiKey') || '';
    const apiSecret = localStorage.getItem('exchangeApiSecret') || '';
    const apiEndpoint = localStorage.getItem('apiEndpoint') || DEFAULT_API_ENDPOINT;
    
    this.api = new KrakenAPI(apiKey, apiSecret, apiEndpoint);
    
    await this.testConnection();
    return this.isConnected;
  }

  public isApiConnected(): boolean {
    return this.isConnected;
  }

  public getConnectionError(): string | null {
    return this.connectionError;
  }

  public getApiEndpoint(): string {
    return this.api.getApiEndpoint();
  }

  public isUsingFallback(): boolean {
    return this.usingFallbackEndpoint;
  }

  private formatKrakenPair(symbol: string, fullName: string): MarketData {
    const baseSymbol = symbol.startsWith('X') ? symbol.substring(1, 4) : symbol.substring(0, 3);
    const quoteSymbol = symbol.endsWith('ZUSD') ? 'USD' : symbol.substring(symbol.length - 3);
    
    const normalizedBase = baseSymbol === 'XBT' ? 'BTC' : baseSymbol;
    
    return {
      id: symbol,
      name: fullName || `${normalizedBase}/${quoteSymbol}`,
      symbol: normalizedBase,
      price: "0",
      change24h: 0,
      volume: '0',
      marketCap: '0',
      tracked: false
    };
  }

  public async getMarketPairs(): Promise<MarketData[]> {
    if (!this.connectionAttempted) {
      await this.testConnection();
    }

    if (!this.isConnected) {
      console.warn('Kraken API not connected, falling back to mock data');
      throw new Error(this.connectionError || 'Failed to connect to Kraken API');
    }

    try {
      // Use the Time endpoint as a simple test if the connection works
      console.log('Checking time endpoint first to verify connectivity...');
      const timeResponse = await fetch(`${this.api.getApiEndpoint()}/0/public/Time`);
      if (!timeResponse.ok) {
        throw new Error(`Cannot reach Kraken Time endpoint: ${timeResponse.statusText}`);
      }
      
      console.log('Time endpoint check successful, fetching pairs...');
      const response = await fetch(`${this.api.getApiEndpoint()}/0/public/AssetPairs`);
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('AssetPairs API response:', data);
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      const usdPairs = Object.entries(data.result)
        .filter(([pair]) => pair.endsWith('USD') || pair.endsWith('ZUSD'))
        .map(([pair, info]: [string, any]) => {
          return this.formatKrakenPair(pair, info.wsname);
        });
      
      console.log(`Found ${usdPairs.length} USD trading pairs`);
      return await this.updateMarketData(usdPairs);
    } catch (error) {
      console.error('Error fetching Kraken market pairs:', error);
      this.connectionError = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  public async updateMarketData(markets: MarketData[]): Promise<MarketData[]> {
    if (!this.connectionAttempted) {
      await this.testConnection();
    }
    
    if (!this.isConnected || markets.length === 0) {
      if (!this.isConnected) {
        throw new Error(this.connectionError || 'Not connected to Kraken API');
      }
      return markets;
    }

    try {
      const pairs = markets.map(market => market.id).join(',');
      const response = await fetch(`${this.api.getApiEndpoint()}/0/public/Ticker?pair=${pairs}`);
      
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      return markets.map(market => {
        const tickerData = data.result[market.id];
        if (!tickerData) return market;
        
        const price = parseFloat(tickerData.c[0]);
        const volume24h = parseFloat(tickerData.v[1]);
        const open24h = parseFloat(tickerData.o);
        const change24h = ((price - open24h) / open24h) * 100;
        
        return {
          ...market,
          price: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change24h: parseFloat(change24h.toFixed(2)),
          volume: `$${(volume24h * price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          marketCap: 'N/A'
        };
      });
    } catch (error) {
      console.error('Error updating Kraken market data:', error);
      this.connectionError = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }
}

export const krakenMarketService = new KrakenMarketService();
