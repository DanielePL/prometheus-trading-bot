
import { MarketData } from '@/types/market';
import { KrakenAPI } from '@/components/trading/KrakenAPI';
import { useToast } from '@/hooks/use-toast';

// Default endpoint for Kraken API - using a CORS proxy to avoid browser restrictions
const DEFAULT_API_ENDPOINT = 'https://cors-proxy.fringe.zone/https://api.kraken.com';
// Fallback endpoint option if the main one fails
const FALLBACK_API_ENDPOINT = 'https://api-pub.bitfinex.com';

export class KrakenMarketService {
  private api: KrakenAPI;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private connectionAttempted: boolean = false;
  private usingFallbackEndpoint: boolean = false;

  constructor() {
    // Get API keys from localStorage or use empty strings for public endpoints
    const apiKey = localStorage.getItem('exchangeApiKey') || '';
    const apiSecret = localStorage.getItem('exchangeApiSecret') || '';
    const apiEndpoint = localStorage.getItem('apiEndpoint') || DEFAULT_API_ENDPOINT;
    
    // Initialize the Kraken API
    this.api = new KrakenAPI(apiKey, apiSecret, apiEndpoint);
    
    // Don't test connection in constructor to avoid blocking app initialization
    // Connection will be tested on first data request
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

  // Try using a fallback endpoint if the primary one fails
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

  // Reset connection status and force a new connection attempt
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

  // Get the API endpoint for use in other components
  public getApiEndpoint(): string {
    return this.api.getApiEndpoint();
  }

  // Is the service using a fallback endpoint?
  public isUsingFallback(): boolean {
    return this.usingFallbackEndpoint;
  }

  // Convert Kraken symbol to our application format
  private formatKrakenPair(symbol: string, fullName: string): MarketData {
    // Convert Kraken format (XXBTZUSD) to our format (BTC-USD)
    const baseSymbol = symbol.startsWith('X') ? symbol.substring(1, 4) : symbol.substring(0, 3);
    const quoteSymbol = symbol.endsWith('ZUSD') ? 'USD' : symbol.substring(symbol.length - 3);
    
    // Special case for Bitcoin (XBT → BTC)
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

  // Get all available trading pairs from Kraken
  public async getMarketPairs(): Promise<MarketData[]> {
    // Always test connection before first request
    if (!this.connectionAttempted) {
      await this.testConnection();
    }

    if (!this.isConnected) {
      console.warn('Kraken API not connected, falling back to mock data');
      throw new Error(this.connectionError || 'Failed to connect to Kraken API');
    }

    try {
      // Use a simple public endpoint to get asset pairs info
      const response = await fetch(`${this.api.getApiEndpoint()}/0/public/AssetPairs`);
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      // Filter for pairs that end with USD and convert to our format
      const usdPairs = Object.entries(data.result)
        .filter(([pair]) => pair.endsWith('USD') || pair.endsWith('ZUSD'))
        .map(([pair, info]: [string, any]) => {
          return this.formatKrakenPair(pair, info.wsname);
        });
      
      // Get current prices and info for these pairs
      return await this.updateMarketData(usdPairs);
    } catch (error) {
      console.error('Error fetching Kraken market pairs:', error);
      this.connectionError = error instanceof Error ? error.message : String(error);
      throw error; // Propagate error to caller
    }
  }

  // Update market data with current prices
  public async updateMarketData(markets: MarketData[]): Promise<MarketData[]> {
    // Test connection if not already attempted
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
      // Get ticker information for all pairs
      const pairs = markets.map(market => market.id).join(',');
      const response = await fetch(`${this.api.getApiEndpoint()}/0/public/Ticker?pair=${pairs}`);
      
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      // Update each market with real data
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
          marketCap: 'N/A' // Kraken doesn't provide market cap data
        };
      });
    } catch (error) {
      console.error('Error updating Kraken market data:', error);
      this.connectionError = error instanceof Error ? error.message : String(error);
      throw error; // Propagate error to caller
    }
  }
}

// Create singleton instance
export const krakenMarketService = new KrakenMarketService();
