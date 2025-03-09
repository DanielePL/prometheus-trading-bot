
import { MarketData } from '@/types/market';
import { KrakenAPI } from '@/components/trading/KrakenAPI';

// Default endpoint for Kraken API
const DEFAULT_API_ENDPOINT = 'https://api.kraken.com';

export class KrakenMarketService {
  private api: KrakenAPI;
  private isConnected: boolean = false;

  constructor() {
    // Get API keys from localStorage or use empty strings for public endpoints
    const apiKey = localStorage.getItem('exchangeApiKey') || '';
    const apiSecret = localStorage.getItem('exchangeApiSecret') || '';
    const apiEndpoint = localStorage.getItem('apiEndpoint') || DEFAULT_API_ENDPOINT;
    
    // Initialize the Kraken API
    this.api = new KrakenAPI(apiKey, apiSecret, apiEndpoint);
    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      const result = await this.api.testConnectionWithDetails();
      this.isConnected = result.success;
      console.log(`Kraken market service connection: ${result.success ? 'connected' : 'failed'}`);
    } catch (error) {
      console.error('Kraken market service connection error:', error);
      this.isConnected = false;
    }
  }

  public isApiConnected(): boolean {
    return this.isConnected;
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
      price: 0,
      change24h: 0,
      volume: '0',
      marketCap: '0',
      tracked: false
    };
  }

  // Get all available trading pairs from Kraken
  public async getMarketPairs(): Promise<MarketData[]> {
    if (!this.isConnected) {
      console.warn('Kraken API not connected, falling back to mock data');
      return [];
    }

    try {
      // Use a simple public endpoint to get asset pairs info
      const response = await fetch(`${DEFAULT_API_ENDPOINT}/0/public/AssetPairs`);
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
      return [];
    }
  }

  // Update market data with current prices
  public async updateMarketData(markets: MarketData[]): Promise<MarketData[]> {
    if (!this.isConnected || markets.length === 0) {
      return markets;
    }

    try {
      // Get ticker information for all pairs
      const pairs = markets.map(market => market.id).join(',');
      const response = await fetch(`${DEFAULT_API_ENDPOINT}/0/public/Ticker?pair=${pairs}`);
      
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
      return markets;
    }
  }
}

// Create singleton instance
export const krakenMarketService = new KrakenMarketService();
