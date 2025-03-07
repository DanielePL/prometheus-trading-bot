import { Candle, OrderBook } from '../trading/TradingBotAPI';

export interface BullRunParameters {
  isBullRun: boolean;
  confidence: number;
  stopLossPercentage: number;
  lastDetected: string;
}

export class BullRunDetector {
  // Parameters for bull run detection
  private volumeSurgeThreshold: number = 1.8; // Volume 1.8x above average
  private priceIncreaseThreshold: number = 0.03; // 3% price increase
  private macdThreshold: number = 0.0015; // MACD threshold
  private rsiThreshold: number = 65; // RSI threshold
  
  // Detection history
  private detectionHistory: BullRunParameters[] = [];
  
  constructor() {
    // Load detection history from localStorage if available
    try {
      const storedHistory = localStorage.getItem('bull_run_history');
      if (storedHistory) {
        this.detectionHistory = JSON.parse(storedHistory);
      }
    } catch (error) {
      console.error('Error loading bull run history:', error);
    }
  }
  
  // Analyze market data for bull run patterns
  analyzeMarket(candles: Candle[], orderBook: OrderBook): BullRunParameters {
    if (candles.length < 50) {
      return {
        isBullRun: false,
        confidence: 0,
        stopLossPercentage: 1,
        lastDetected: 'Insufficient data'
      };
    }
    
    // Calculate key indicators
    const volumeRatio = this.calculateVolumeRatio(candles, 10);
    const priceChange = this.calculatePriceChange(candles, 5);
    const rsi = this.calculateRSI(candles, 14);
    const macd = this.calculateMACD(candles);
    const marketStructure = this.analyzeMarketStructure(candles);
    const orderBookImbalance = this.calculateOrderBookImbalance(orderBook);
    
    // Check bull run conditions with weighted importance
    let bullRunScore = 0;
    if (volumeRatio > this.volumeSurgeThreshold) bullRunScore += 0.2;
    if (priceChange > this.priceIncreaseThreshold) bullRunScore += 0.25;
    if (rsi > this.rsiThreshold) bullRunScore += 0.15;
    if (macd.signal > this.macdThreshold) bullRunScore += 0.15;
    if (marketStructure.higherLows && marketStructure.higherHighs) bullRunScore += 0.15;
    if (orderBookImbalance > 0.6) bullRunScore += 0.1;
    
    // Determine if bull run is detected
    const isBullRun = bullRunScore > 0.65;
    
    // Calculate confidence level
    const confidence = Math.min(bullRunScore, 0.95);
    
    // Calculate recommended stop loss percentage based on volatility
    let stopLossPercentage = 2; // Base stop loss value
    
    if (isBullRun) {
      // Fine-tune stop loss based on volatility and confidence
      const volatility = this.calculateVolatility(candles, 14);
      stopLossPercentage = Math.max(1, Math.min(5, volatility * 2 * (1 - confidence * 0.3)));
      
      // Round to 1 decimal place
      stopLossPercentage = Math.round(stopLossPercentage * 10) / 10;
    }
    
    const result: BullRunParameters = {
      isBullRun,
      confidence,
      stopLossPercentage,
      lastDetected: isBullRun ? 'Just now' : this.getLastDetectionTime()
    };
    
    // Update detection history
    if (isBullRun) {
      this.detectionHistory.push({
        ...result,
        lastDetected: new Date().toISOString()
      });
      
      // Keep only last 10 detections
      if (this.detectionHistory.length > 10) {
        this.detectionHistory = this.detectionHistory.slice(-10);
      }
      
      // Save to localStorage
      localStorage.setItem('bull_run_history', JSON.stringify(this.detectionHistory));
    }
    
    return result;
  }
  
  // Calculate recent volume ratio compared to average
  private calculateVolumeRatio(candles: Candle[], period: number): number {
    const recentCandles = candles.slice(-period);
    const olderCandles = candles.slice(-period * 2, -period);
    
    const recentVolume = recentCandles.reduce((sum, candle) => sum + candle.volume, 0) / recentCandles.length;
    const olderVolume = olderCandles.reduce((sum, candle) => sum + candle.volume, 0) / olderCandles.length;
    
    return olderVolume > 0 ? recentVolume / olderVolume : 1;
  }
  
  // Calculate recent price change percentage
  private calculatePriceChange(candles: Candle[], period: number): number {
    const currentPrice = candles[candles.length - 1].close;
    const previousPrice = candles[candles.length - period - 1].close;
    
    return (currentPrice - previousPrice) / previousPrice;
  }
  
  // Calculate RSI (Relative Strength Index)
  private calculateRSI(candles: Candle[], period: number): number {
    const prices = candles.map(c => c.close);
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }
  
  // Calculate MACD (Moving Average Convergence Divergence)
  private calculateMACD(candles: Candle[]): { macd: number, signal: number, histogram: number } {
    const prices = candles.map(c => c.close);
    
    // Calculate EMAs
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const macd = ema12 - ema26;
    
    // Calculate signal line (9-day EMA of MACD)
    const macdValues = [];
    for (let i = prices.length - 30; i < prices.length; i++) {
      const macdEma12 = this.calculateEMA(prices.slice(0, i + 1), 12);
      const macdEma26 = this.calculateEMA(prices.slice(0, i + 1), 26);
      macdValues.push(macdEma12 - macdEma26);
    }
    
    const signal = this.calculateEMA(macdValues, 9);
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }
  
  // Calculate EMA (Exponential Moving Average)
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }
    
    return ema;
  }
  
  // Analyze market structure for higher highs and higher lows
  private analyzeMarketStructure(candles: Candle[]): { higherHighs: boolean, higherLows: boolean } {
    const segments = 3; // Number of segments to check
    const segmentSize = 5; // Size of each segment
    
    const segmentHighs = [];
    const segmentLows = [];
    
    for (let i = 0; i < segments; i++) {
      const start = candles.length - (i + 1) * segmentSize;
      const end = candles.length - i * segmentSize;
      
      if (start < 0) continue;
      
      const segment = candles.slice(start, end);
      
      const high = Math.max(...segment.map(c => c.high));
      const low = Math.min(...segment.map(c => c.low));
      
      segmentHighs.push(high);
      segmentLows.push(low);
    }
    
    // Check for higher highs and higher lows
    const higherHighs = segmentHighs.length >= 2 && segmentHighs[0] > segmentHighs[1];
    const higherLows = segmentLows.length >= 2 && segmentLows[0] > segmentLows[1];
    
    return { higherHighs, higherLows };
  }
  
  // Calculate order book buy/sell imbalance (Buy pressure)
  private calculateOrderBookImbalance(orderBook: OrderBook): number {
    if (!orderBook || !orderBook.bids || !orderBook.asks) return 0.5;
    
    const bidVolume = orderBook.bids.reduce((sum, bid) => sum + bid[1], 0);
    const askVolume = orderBook.asks.reduce((sum, ask) => sum + ask[1], 0);
    
    const totalVolume = bidVolume + askVolume;
    if (totalVolume === 0) return 0.5;
    
    return bidVolume / totalVolume;
  }
  
  // Calculate price volatility
  private calculateVolatility(candles: Candle[], period: number): number {
    const prices = candles.slice(-period).map(c => c.close);
    const returns = [];
    
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    // Calculate standard deviation of returns
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    
    return Math.sqrt(variance);
  }
  
  // Get the time of the last bull run detection
  private getLastDetectionTime(): string {
    if (this.detectionHistory.length === 0) return 'Never';
    
    const lastDetection = this.detectionHistory[this.detectionHistory.length - 1];
    const lastTime = new Date(lastDetection.lastDetected);
    const now = new Date();
    
    const diffMs = now.getTime() - lastTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}

// Export a singleton instance for global use
export const bullRunDetector = new BullRunDetector();
