import { MarketData } from '@/types/market';
import { KrakenAPI } from '@/components/trading/KrakenAPI';
import { useToast } from '@/hooks/use-toast';

// Default endpoint for Kraken API - using a CORS proxy to avoid browser restrictions
const DEFAULT_API_ENDPOINT = 'https://cors-proxy.fringe.zone/https://api.kraken.com';
// Fallback endpoint option if the main one fails
const FALLBACK_API_ENDPOINT = 'https://api-pub.bitfinex.com';

// Test API credentials - FOR TESTING PURPOSES ONLY
// In production, these should be securely stored
const TEST_API_KEY = 'p1XiHHWQiJzxpZpeXj5I52pMiJVsBGzyYVF7KqMz13cGKv0gjJCIhpDN';
const TEST_API_SECRET = 'yB5FRqbIwOqyzUoxtkdHHCqSnk8N8vfmGeRnBJwItmUHAVLuNtsYic1f1u1U3qOIxHDxjIlvzl0TPCPZCC7s9Q==';

export class KrakenMarketService {
  private api: KrakenAPI;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private connectionAttempted: boolean = false;
  private usingFallbackEndpoint: boolean = false;

  constructor() {
    // Use hardcoded test keys for development/testing
    // In production, these would come from a secure source
    const apiKey = TEST_API_KEY;
    const apiSecret = TEST_API_SECRET;
    const apiEndpoint = DEFAULT_API_ENDPOINT;
    
    // Initialize the Kraken API
    this.api = new KrakenAPI(apiKey, apiSecret, apiEndpoint);
    
    // Store keys in localStorage for compatibility with other components
    if (apiKey && apiSecret) {
      localStorage.setItem('exchangeApiKey', apiKey);
      localStorage.setItem('exchangeApiSecret', apiSecret);
      localStorage.setItem('apiEndpoint', apiEndpoint);
    }
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
      const response = await fetch(`${this.api.getApiEndpoint()}/0/public/AssetPairs`);
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      const usdPairs = Object.entries(data.result)
        .filter(([pair]) => pair.endsWith('USD') || pair.endsWith('ZUSD'))
        .map(([pair, info]: [string, any]) => {
          return this.formatKrakenPair(pair, info.wsname);
        });
      
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
