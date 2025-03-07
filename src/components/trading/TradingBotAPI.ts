// This file contains the trading bot API integration

// Define exchange API interfaces
export interface ExchangeAPI {
  fetchMarketData: (symbol: string) => Promise<MarketData>;
  executeOrder: (order: OrderPayload) => Promise<OrderResult>;
  getOrderBook: (symbol: string) => Promise<OrderBook>;
  fetchCandles: (symbol: string, timeframe: string) => Promise<Candle[]>;
}

// Market data interface
export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  change24h: number;
  timestamp: number;
}

// Order book interface
export interface OrderBook {
  bids: [number, number][]; // [price, amount]
  asks: [number, number][]; // [price, amount]
}

// Candle data interface
export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

// Order payload interface
export interface OrderPayload {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
}

// Order result interface
export interface OrderResult {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  status: 'open' | 'closed' | 'canceled' | 'rejected';
  price: number;
  quantity: number;
  filledQuantity: number;
  timestamp: number;
}

// Mock implementation of ExchangeAPI for simulation
export class MockExchangeAPI implements ExchangeAPI {
  private currentPrice: number = 40000 + Math.random() * 2000;
  private priceChangeTrend: number = 0;
  
  constructor() {
    // Initialize with a random price trend (up or down)
    this.priceChangeTrend = Math.random() > 0.5 ? 1 : -1;
    
    // Simulate price changes every few seconds
    setInterval(() => {
      // Occasionally change trend direction
      if (Math.random() > 0.9) {
        this.priceChangeTrend *= -1;
      }
      
      // Apply random price change
      const change = (Math.random() * 100) * this.priceChangeTrend;
      this.currentPrice += change;
      
      // Ensure price doesn't go below a reasonable floor
      if (this.currentPrice < 35000) {
        this.currentPrice = 35000 + Math.random() * 1000;
        this.priceChangeTrend = 1;
      }
      
      // Ensure price doesn't go above a reasonable ceiling
      if (this.currentPrice > 45000) {
        this.currentPrice = 45000 - Math.random() * 1000;
        this.priceChangeTrend = -1;
      }
    }, 5000);
  }
  
  async fetchMarketData(symbol: string): Promise<MarketData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    // Generate random market data based on current price
    const price = this.currentPrice;
    const high24h = price * (1 + Math.random() * 0.05);
    const low24h = price * (1 - Math.random() * 0.05);
    const volume24h = 1000 + Math.random() * 5000;
    const change24h = (Math.random() * 5) * this.priceChangeTrend;
    
    return {
      symbol,
      price,
      high24h,
      low24h,
      volume24h,
      change24h,
      timestamp: Date.now()
    };
  }
  
  async executeOrder(order: OrderPayload): Promise<OrderResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate order execution
    const price = order.type === 'market' 
      ? this.currentPrice * (1 + (order.side === 'buy' ? 0.001 : -0.001))
      : order.price || this.currentPrice;
    
    // Simulate partial fills occasionally
    const filledRatio = Math.random() > 0.8 ? 0.8 + Math.random() * 0.2 : 1;
    const filledQuantity = order.quantity * filledRatio;
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      status: Math.random() > 0.95 ? 'rejected' : 'closed',
      price,
      quantity: order.quantity,
      filledQuantity,
      timestamp: Date.now()
    };
  }
  
  async getOrderBook(symbol: string): Promise<OrderBook> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const currentPrice = this.currentPrice;
    
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
  
  async fetchCandles(symbol: string, timeframe: string): Promise<Candle[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600));
    
    const candles: Candle[] = [];
    const periods = timeframe === '1h' ? 24 : timeframe === '1d' ? 30 : 60;
    let lastClose = this.currentPrice * 0.9;
    
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

// Creating a singleton instance of the mock exchange API
export const exchangeAPI = new MockExchangeAPI();

// Import the new strategy
import { DynamicStopLossStrategy } from './strategies/DynamicStopLossStrategy';

// Strategy implementations

export interface TradingStrategy {
  analyze: (candles: Candle[], orderBook: OrderBook) => TradingSignal;
  getName: () => string;
}

export type TradingSignal = {
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-1
  targetPrice?: number;
  stopLoss?: number;
  reason: string;
}

// Moving Average Crossover Strategy
export class MAStrategy implements TradingStrategy {
  private shortPeriod: number;
  private longPeriod: number;
  
  constructor(shortPeriod: number = 9, longPeriod: number = 21) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
  }
  
  getName(): string {
    return "Moving Average Crossover";
  }
  
  analyze(candles: Candle[], orderBook: OrderBook): TradingSignal {
    if (candles.length < this.longPeriod) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for analysis'
      };
    }
    
    // Calculate short MA
    const shortMA = this.calculateMA(candles, this.shortPeriod);
    
    // Calculate long MA
    const longMA = this.calculateMA(candles, this.longPeriod);
    
    // Previous values
    const prevShortMA = this.calculateMA(candles.slice(0, -1), this.shortPeriod);
    const prevLongMA = this.calculateMA(candles.slice(0, -1), this.longPeriod);
    
    // Current price
    const currentPrice = candles[candles.length - 1].close;
    
    // Golden cross (short MA crosses above long MA)
    if (shortMA > longMA && prevShortMA <= prevLongMA) {
      const confidence = Math.min(1, (shortMA - longMA) / longMA * 10);
      return {
        action: 'buy',
        confidence,
        targetPrice: currentPrice * 1.03,
        stopLoss: currentPrice * 0.98,
        reason: 'Golden cross detected: short MA crossed above long MA'
      };
    }
    
    // Death cross (short MA crosses below long MA)
    if (shortMA < longMA && prevShortMA >= prevLongMA) {
      const confidence = Math.min(1, (longMA - shortMA) / longMA * 10);
      return {
        action: 'sell',
        confidence,
        targetPrice: currentPrice * 0.97,
        stopLoss: currentPrice * 1.02,
        reason: 'Death cross detected: short MA crossed below long MA'
      };
    }
    
    // No cross, but check trend strength
    if (shortMA > longMA) {
      const strength = (shortMA - longMA) / longMA;
      if (strength > 0.02) {
        return {
          action: 'buy',
          confidence: Math.min(0.7, strength * 5),
          reason: 'Strong upward trend: short MA significantly above long MA'
        };
      }
    } else {
      const strength = (longMA - shortMA) / longMA;
      if (strength > 0.02) {
        return {
          action: 'sell',
          confidence: Math.min(0.7, strength * 5),
          reason: 'Strong downward trend: short MA significantly below long MA'
        };
      }
    }
    
    return {
      action: 'hold',
      confidence: 0.5,
      reason: 'No significant trend detected'
    };
  }
  
  private calculateMA(candles: Candle[], period: number): number {
    const relevantCandles = candles.slice(-period);
    const sum = relevantCandles.reduce((acc, candle) => acc + candle.close, 0);
    return sum / relevantCandles.length;
  }
}

// RSI Strategy
export class RSIStrategy implements TradingStrategy {
  private period: number;
  private overbought: number;
  private oversold: number;
  
  constructor(period: number = 14, overbought: number = 70, oversold: number = 30) {
    this.period = period;
    this.overbought = overbought;
    this.oversold = oversold;
  }
  
  getName(): string {
    return "RSI Oscillator";
  }
  
  analyze(candles: Candle[], orderBook: OrderBook): TradingSignal {
    if (candles.length < this.period + 1) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for RSI calculation'
      };
    }
    
    const rsi = this.calculateRSI(candles);
    const prevRsi = this.calculateRSI(candles.slice(0, -1));
    const currentPrice = candles[candles.length - 1].close;
    
    // Oversold and starting to rise
    if (rsi < this.oversold && rsi > prevRsi) {
      const confidence = Math.min(1, (this.oversold - rsi) / this.oversold * 2);
      return {
        action: 'buy',
        confidence,
        targetPrice: currentPrice * 1.05,
        stopLoss: currentPrice * 0.97,
        reason: `RSI is oversold (${rsi.toFixed(2)}) and rising - potential bullish reversal`
      };
    }
    
    // Overbought and starting to fall
    if (rsi > this.overbought && rsi < prevRsi) {
      const confidence = Math.min(1, (rsi - this.overbought) / (100 - this.overbought) * 2);
      return {
        action: 'sell',
        confidence,
        targetPrice: currentPrice * 0.95,
        stopLoss: currentPrice * 1.03,
        reason: `RSI is overbought (${rsi.toFixed(2)}) and falling - potential bearish reversal`
      };
    }
    
    // Extreme readings
    if (rsi < 20) {
      return {
        action: 'buy',
        confidence: 0.6,
        reason: `RSI extremely oversold (${rsi.toFixed(2)}) - market may be due for a bounce`
      };
    }
    
    if (rsi > 80) {
      return {
        action: 'sell',
        confidence: 0.6,
        reason: `RSI extremely overbought (${rsi.toFixed(2)}) - market may be due for a pullback`
      };
    }
    
    return {
      action: 'hold',
      confidence: 0.5,
      reason: `RSI in neutral zone (${rsi.toFixed(2)})`
    };
  }
  
  private calculateRSI(candles: Candle[]): number {
    const relevantCandles = candles.slice(-this.period - 1);
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < relevantCandles.length; i++) {
      const change = relevantCandles[i].close - relevantCandles[i - 1].close;
      if (change >= 0) {
        gains += change;
      } else {
        losses -= change; // Make loss positive
      }
    }
    
    const periodLength = relevantCandles.length - 1;
    const avgGain = gains / periodLength;
    const avgLoss = losses / periodLength;
    
    if (avgLoss === 0) return 100; // Avoid division by zero
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }
}

// Bollinger Bands Strategy
export class BollingerBandsStrategy implements TradingStrategy {
  private period: number;
  private deviations: number;
  
  constructor(period: number = 20, deviations: number = 2) {
    this.period = period;
    this.deviations = deviations;
  }
  
  getName(): string {
    return "Bollinger Bands";
  }
  
  analyze(candles: Candle[], orderBook: OrderBook): TradingSignal {
    if (candles.length < this.period) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for Bollinger Bands calculation'
      };
    }
    
    const relevantCandles = candles.slice(-this.period);
    const currentPrice = candles[candles.length - 1].close;
    
    // Calculate middle band (SMA)
    const middleBand = this.calculateSMA(relevantCandles);
    
    // Calculate standard deviation
    const stdDev = this.calculateStdDev(relevantCandles, middleBand);
    
    // Calculate upper and lower bands
    const upperBand = middleBand + (this.deviations * stdDev);
    const lowerBand = middleBand - (this.deviations * stdDev);
    
    // Calculate band width
    const bandWidth = (upperBand - lowerBand) / middleBand;
    
    // Price near or below lower band
    if (currentPrice <= lowerBand * 1.01) {
      // Calculate how far below (or close to) the lower band
      const distance = (lowerBand - currentPrice) / currentPrice;
      const confidence = Math.min(0.9, 0.6 + distance * 10);
      
      return {
        action: 'buy',
        confidence,
        targetPrice: middleBand,
        stopLoss: lowerBand * 0.98,
        reason: `Price at/below lower Bollinger Band (${lowerBand.toFixed(2)}) - potential bounce`
      };
    }
    
    // Price near or above upper band
    if (currentPrice >= upperBand * 0.99) {
      // Calculate how far above (or close to) the upper band
      const distance = (currentPrice - upperBand) / currentPrice;
      const confidence = Math.min(0.9, 0.6 + distance * 10);
      
      return {
        action: 'sell',
        confidence,
        targetPrice: middleBand,
        stopLoss: upperBand * 1.02,
        reason: `Price at/above upper Bollinger Band (${upperBand.toFixed(2)}) - potential reversal`
      };
    }
    
    // Squeeze pattern (bands narrowing significantly)
    if (bandWidth < 0.03) {
      return {
        action: 'hold',
        confidence: 0.7,
        reason: 'Bollinger Bands squeeze detected - preparing for breakout'
      };
    }
    
    // Price in middle of bands
    const position = (currentPrice - lowerBand) / (upperBand - lowerBand);
    if (position > 0.45 && position < 0.55) {
      return {
        action: 'hold',
        confidence: 0.4,
        reason: 'Price in middle of Bollinger Bands - no clear signal'
      };
    }
    
    // Other cases - weaker signals
    if (position < 0.3) {
      return {
        action: 'buy',
        confidence: 0.3,
        reason: 'Price in lower section of Bollinger Bands - slight bullish bias'
      };
    }
    
    if (position > 0.7) {
      return {
        action: 'sell',
        confidence: 0.3,
        reason: 'Price in upper section of Bollinger Bands - slight bearish bias'
      };
    }
    
    return {
      action: 'hold',
      confidence: 0.5,
      reason: 'No clear Bollinger Bands signal'
    };
  }
  
  private calculateSMA(candles: Candle[]): number {
    const sum = candles.reduce((acc, candle) => acc + candle.close, 0);
    return sum / candles.length;
  }
  
  private calculateStdDev(candles: Candle[], mean: number): number {
    const squaredDiffs = candles.map(candle => Math.pow(candle.close - mean, 2));
    const sum = squaredDiffs.reduce((acc, value) => acc + value, 0);
    return Math.sqrt(sum / candles.length);
  }
}

// Factory to get strategy by name
export const getStrategyByName = (name: string): TradingStrategy => {
  switch (name) {
    case 'macrossover':
      return new MAStrategy();
    case 'rsioscillator':
      return new RSIStrategy();
    case 'bollingerbands':
      return new BollingerBandsStrategy();
    case 'dynamicstoploss':
      return new DynamicStopLossStrategy();
    case 'volumeprofile':
      // For now, we'll just return MA as a fallback
      // In a real implementation, this would be a Volume Profile strategy
      return new MAStrategy();
    case 'supportresistance':
      // For now, we'll just return RSI as a fallback
      // In a real implementation, this would be a Support & Resistance strategy
      return new RSIStrategy();
    default:
      return new MAStrategy();
  }
};
