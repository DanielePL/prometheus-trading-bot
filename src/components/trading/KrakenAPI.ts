// This file contains the Kraken API integration
import { 
  ExchangeAPI, 
  MarketData, 
  OrderBook, 
  Candle, 
  OrderPayload, 
  OrderResult 
} from './TradingBotAPI';

export class KrakenAPI implements ExchangeAPI {
  private apiKey: string;
  private apiSecret: string;
  private apiEndpoint: string;
  private isConnected: boolean = false;

  constructor(apiKey: string, apiSecret: string, apiEndpoint: string = 'https://api.kraken.com') {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.apiEndpoint = apiEndpoint;
    this.testConnection();
  }

  // Test if we can connect to Kraken API
  private async testConnection(): Promise<void> {
    try {
      // Simple request to check if API is accessible
      const response = await fetch(`${this.apiEndpoint}/0/public/Time`);
      if (!response.ok) {
        console.error('Kraken API test connection failed:', response.statusText);
        this.isConnected = false;
        return;
      }
      
      const data = await response.json();
      if (data.error && data.error.length > 0) {
        console.error('Kraken API test connection error:', data.error.join(', '));
        this.isConnected = false;
        return;
      }
      
      console.log('Kraken API connection successful', data.result);
      this.isConnected = true;
    } catch (error) {
      console.error('Kraken API connection test failed:', error);
      this.isConnected = false;
    }
  }

  // Check if we're connected to the real Kraken API
  public isApiConnected(): boolean {
    return this.isConnected;
  }

  private async makePublicRequest(method: string, params: Record<string, string> = {}): Promise<any> {
    try {
      // Build query string from params
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Construct URL
      const url = `${this.apiEndpoint}/0/public/${method}${queryString ? '?' + queryString : ''}`;
      
      // Make request
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error && data.error.length > 0) {
        throw new Error(`Kraken API error: ${data.error.join(', ')}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Kraken API request failed:', error);
      throw error;
    }
  }

  private async makePrivateRequest(method: string, params: Record<string, string> = {}): Promise<any> {
    try {
      // For paper trading mode, we'll simulate private API requests
      // In a real implementation, this would include API key auth and signing
      console.log(`[PAPER] Making private Kraken API request: ${method}`, params);
      
      // Return mock responses for paper trading
      if (method === 'AddOrder') {
        return {
          txid: [Math.random().toString(36).substring(2, 15)],
          descr: {
            order: `${params.type} ${params.ordertype} ${params.pair} ${params.volume}`,
          }
        };
      }
      
      return {};
    } catch (error) {
      console.error('Kraken API private request failed:', error);
      throw error;
    }
  }

  // Map Kraken symbol format to our trading pair format and vice versa
  private formatSymbolForKraken(symbol: string): string {
    // BTC-USD -> XBTUSD
    const [base, quote] = symbol.split('-');
    
    // Special case for Bitcoin which is XBT on Kraken
    const baseAsset = base === 'BTC' ? 'XBT' : base;
    
    return baseAsset + quote;
  }

  private formatKrakenSymbol(krakenSymbol: string): string {
    // XBTUSD -> BTC-USD
    // Extract base and quote
    const baseAsset = krakenSymbol.substring(0, krakenSymbol.length - 3);
    const quoteAsset = krakenSymbol.substring(krakenSymbol.length - 3);
    
    // Special case for Bitcoin which is XBT on Kraken
    const base = baseAsset === 'XBT' ? 'BTC' : baseAsset;
    
    return `${base}-${quoteAsset}`;
  }

  async fetchMarketData(symbol: string): Promise<MarketData> {
    try {
      // If we're not connected to the API, use simulation
      if (!this.isConnected) {
        return this.generateSimulatedMarketData(symbol);
      }
      
      const krakenSymbol = this.formatSymbolForKraken(symbol);
      
      // Get ticker information from real API
      const ticker = await this.makePublicRequest('Ticker', { pair: krakenSymbol });
      
      // Get the result for our pair (Kraken returns an object with the pair as key)
      const pairData = ticker[Object.keys(ticker)[0]];
      
      // Extract relevant data
      const price = parseFloat(pairData.c[0]);
      const volume24h = parseFloat(pairData.v[1]);
      const high24h = parseFloat(pairData.h[1]);
      const low24h = parseFloat(pairData.l[1]);
      
      // Calculate 24h change
      const open24h = parseFloat(pairData.o);
      const change24h = ((price - open24h) / open24h) * 100;
      
      return {
        symbol,
        price,
        volume24h,
        high24h,
        low24h,
        change24h,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching Kraken market data:', error);
      
      // Fall back to mock data if API request fails
      return this.generateSimulatedMarketData(symbol);
    }
  }

  // Generate simulated market data when not connected to API
  private generateSimulatedMarketData(symbol: string): MarketData {
    console.log(`[SIMULATION] Generating simulated market data for ${symbol}`);
    const basePrice = symbol.includes('BTC') ? 40000 : 
                     symbol.includes('ETH') ? 2200 :
                     symbol.includes('SOL') ? 150 :
                     symbol.includes('DOGE') ? 0.12 : 1000;
                     
    return {
      symbol,
      price: basePrice + (Math.random() * basePrice * 0.05) - (basePrice * 0.025),
      volume24h: 1000 + Math.random() * 5000,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
      change24h: (Math.random() * 10) - 5,
      timestamp: Date.now()
    };
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    try {
      const krakenSymbol = this.formatSymbolForKraken(symbol);
      
      // Get order book data
      const depth = await this.makePublicRequest('Depth', { 
        pair: krakenSymbol,
        count: '10' // Limit to 10 entries each side - Fixed by converting to string
      });
      
      // Get the result for our pair
      const pairData = depth[Object.keys(depth)[0]];
      
      // Format bids and asks
      const bids: [number, number][] = pairData.bids.map((bid: string[]) => [
        parseFloat(bid[0]), // price
        parseFloat(bid[1])  // amount
      ]);
      
      const asks: [number, number][] = pairData.asks.map((ask: string[]) => [
        parseFloat(ask[0]), // price
        parseFloat(ask[1])  // amount
      ]);
      
      return { bids, asks };
    } catch (error) {
      console.error('Error fetching Kraken order book:', error);
      
      // Fall back to mock data
      const currentPrice = 40000 + Math.random() * 2000;
      
      // Generate synthetic order book data
      const bids: [number, number][] = [];
      const asks: [number, number][] = [];
      
      // Generate 10 bid levels
      for (let i = 0; i < 10; i++) {
        const price = currentPrice * (1 - 0.001 * (i + 1));
        const amount = 0.1 + Math.random() * 2;
        bids.push([price, amount]);
      }
      
      // Generate 10 ask levels
      for (let i = 0; i < 10; i++) {
        const price = currentPrice * (1 + 0.001 * (i + 1));
        const amount = 0.1 + Math.random() * 2;
        asks.push([price, amount]);
      }
      
      return { bids, asks };
    }
  }

  async fetchCandles(symbol: string, timeframe: string): Promise<Candle[]> {
    try {
      const krakenSymbol = this.formatSymbolForKraken(symbol);
      
      // Map timeframe to Kraken interval
      // 1h -> 60, 1d -> 1440, etc.
      const interval = timeframe === '1h' ? 60 : 
                       timeframe === '1d' ? 1440 : 5;
      
      // Get OHLC data
      const ohlc = await this.makePublicRequest('OHLC', {
        pair: krakenSymbol,
        interval: interval.toString() // Convert number to string
      });
      
      // Get the result for our pair
      const pairData = ohlc[Object.keys(ohlc)[0]];
      
      // Format candle data
      const candles: Candle[] = pairData.map((candle: any[]) => ({
        timestamp: candle[0] * 1000, // Convert to milliseconds
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[6])
      }));
      
      return candles;
    } catch (error) {
      console.error('Error fetching Kraken candles:', error);
      
      // Fall back to mock data
      const candles: Candle[] = [];
      const periods = timeframe === '1h' ? 24 : timeframe === '1d' ? 30 : 60;
      let lastClose = 40000 * 0.9;
      
      for (let i = 0; i < periods; i++) {
        const timestamp = Date.now() - (i * 60 * 60 * 1000);
        const change = lastClose * (Math.random() * 0.04 - 0.02);
        const close = lastClose + change;
        const open = lastClose;
        const high = Math.max(open, close) + Math.random() * Math.abs(close - open);
        const low = Math.min(open, close) - Math.random() * Math.abs(close - open);
        const volume = 10 + Math.random() * 90;
        
        candles.unshift({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });
        
        lastClose = close;
      }
      
      return candles;
    }
  }

  async executeOrder(order: OrderPayload): Promise<OrderResult> {
    try {
      // Convert our internal order format to Kraken's format
      const krakenSymbol = this.formatSymbolForKraken(order.symbol);
      
      // Build Kraken order parameters
      const params: Record<string, string> = {
        pair: krakenSymbol,
        type: order.side,                                // buy or sell
        ordertype: order.type === 'market' ? 'market' : 'limit',  // market or limit
        volume: order.quantity.toString(),               // quantity
      };
      
      // Add price for limit orders
      if (order.type === 'limit' && order.price) {
        params.price = order.price.toString();
      }
      
      // Execute the order
      const response = await this.makePrivateRequest('AddOrder', params);
      
      // Get current price for reporting
      const marketData = await this.fetchMarketData(order.symbol);
      const price = order.type === 'limit' && order.price ? order.price : marketData.price;
      
      // Build result
      return {
        id: response.txid[0],
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        status: 'closed', // Assuming success for simplicity
        price,
        quantity: order.quantity,
        filledQuantity: order.quantity, // Assuming full fill for simplicity
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error executing Kraken order:', error);
      
      // Return a rejected order in case of error
      return {
        id: Math.random().toString(36).substring(2, 15),
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        status: 'rejected',
        price: order.price || 0,
        quantity: order.quantity,
        filledQuantity: 0,
        timestamp: Date.now()
      };
    }
  }
}
