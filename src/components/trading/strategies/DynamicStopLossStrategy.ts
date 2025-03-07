
import { TradingStrategy, TradingSignal, Candle, OrderBook } from '../TradingBotAPI';

/**
 * DynamicStopLossStrategy combines a momentum-based approach with dynamic stop loss management.
 * It scans for bull runs (sustained upward price movements) and adjusts stop loss levels
 * based on current profit percentage.
 */
export class DynamicStopLossStrategy implements TradingStrategy {
  private lookbackPeriod: number;
  private momentumThreshold: number;
  private minimumStopLoss: number; // Minimum stop loss percentage
  private trailingFactor: number; // How much of gains to protect
  
  constructor(
    lookbackPeriod: number = 8, 
    momentumThreshold: number = 0.02, 
    minimumStopLoss: number = 0.01, 
    trailingFactor: number = 0.8
  ) {
    this.lookbackPeriod = lookbackPeriod;
    this.momentumThreshold = momentumThreshold;
    this.minimumStopLoss = minimumStopLoss;
    this.trailingFactor = trailingFactor;
  }
  
  getName(): string {
    return "Dynamic Stop Loss + Bull Run Scanner";
  }
  
  analyze(candles: Candle[], orderBook: OrderBook): TradingSignal {
    if (candles.length < this.lookbackPeriod + 1) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for analysis'
      };
    }
    
    // Calculate recent price movement
    const currentPrice = candles[candles.length - 1].close;
    const lookbackPrice = candles[candles.length - this.lookbackPeriod - 1].close;
    const priceChange = (currentPrice - lookbackPrice) / lookbackPrice;
    
    // Check for bull run (significant upward momentum)
    const isBullRun = this.detectBullRun(candles);
    
    // Calculate volume trend
    const volumeTrend = this.calculateVolumeTrend(candles);
    
    // Calculate dynamic stop loss
    const stopLossLevel = this.calculateDynamicStopLoss(candles, priceChange);
    
    // Check for strong buy signal (bull run + increasing volume)
    if (isBullRun && volumeTrend > 1.1 && priceChange > this.momentumThreshold) {
      return {
        action: 'buy',
        confidence: Math.min(0.9, 0.6 + priceChange * 2),
        targetPrice: currentPrice * 1.05,
        stopLoss: currentPrice * (1 - stopLossLevel),
        reason: `Bull run detected with increasing volume. Dynamic stop loss set at ${(stopLossLevel * 100).toFixed(2)}%`
      };
    }
    
    // Check for sell signal (price reversal after uptrend)
    if (priceChange > 0.01 && this.detectReversal(candles)) {
      return {
        action: 'sell',
        confidence: Math.min(0.8, 0.5 + Math.abs(priceChange)),
        targetPrice: currentPrice * 0.97,
        stopLoss: currentPrice * 1.02,
        reason: 'Price reversal detected after uptrend, taking profits'
      };
    }
    
    // Weak bull signal
    if (priceChange > 0.005) {
      return {
        action: 'buy',
        confidence: 0.4,
        targetPrice: currentPrice * 1.03,
        stopLoss: currentPrice * (1 - stopLossLevel),
        reason: `Positive momentum detected. Dynamic stop loss set at ${(stopLossLevel * 100).toFixed(2)}%`
      };
    }
    
    // Weak bear signal
    if (priceChange < -0.01) {
      return {
        action: 'sell',
        confidence: 0.3,
        targetPrice: currentPrice * 0.97,
        stopLoss: currentPrice * 1.015,
        reason: 'Downward momentum detected'
      };
    }
    
    return {
      action: 'hold',
      confidence: 0.5,
      reason: 'No significant trend detected'
    };
  }
  
  /**
   * Detects a bull run by checking for consecutive higher lows and higher highs
   */
  private detectBullRun(candles: Candle[]): boolean {
    const recentCandles = candles.slice(-this.lookbackPeriod);
    
    let higherHighsCount = 0;
    let higherLowsCount = 0;
    
    // Check for higher highs
    for (let i = 2; i < recentCandles.length; i++) {
      if (recentCandles[i].high > recentCandles[i-2].high) {
        higherHighsCount++;
      }
    }
    
    // Check for higher lows
    for (let i = 2; i < recentCandles.length; i++) {
      if (recentCandles[i].low > recentCandles[i-2].low) {
        higherLowsCount++;
      }
    }
    
    // Bull run requires both higher highs and higher lows
    const higherHighsRatio = higherHighsCount / (recentCandles.length - 2);
    const higherLowsRatio = higherLowsCount / (recentCandles.length - 2);
    
    return higherHighsRatio > 0.6 && higherLowsRatio > 0.5;
  }
  
  /**
   * Calculates dynamic stop loss based on current profit percentage
   * - Minimum stop loss is applied when profit is low or negative
   * - As profit increases, stop loss trails behind by trailingFactor
   */
  private calculateDynamicStopLoss(candles: Candle[], currentProfitPercentage: number): number {
    if (currentProfitPercentage <= 0) {
      return this.minimumStopLoss;
    }
    
    // Dynamic stop loss: min stop loss + (profit * trailing factor)
    // Example: 1% minimum stop loss, 80% trailing factor
    // - At 5% profit: stop loss = 1% + (5% * 80%) = 5%
    // - At 10% profit: stop loss = 1% + (10% * 80%) = 9%
    const dynamicStopLoss = this.minimumStopLoss + (currentProfitPercentage * this.trailingFactor);
    
    return Math.max(this.minimumStopLoss, dynamicStopLoss);
  }
  
  /**
   * Detect a potential price reversal
   */
  private detectReversal(candles: Candle[]): boolean {
    const recentCandles = candles.slice(-3);
    
    // Simple reversal pattern: price was going up, then makes a lower high and lower low
    if (recentCandles[0].close < recentCandles[0].open &&  // Bearish candle
        recentCandles[1].high < recentCandles[0].high &&  // Lower high
        recentCandles[2].low < recentCandles[1].low) {    // Lower low
      return true;
    }
    
    return false;
  }
  
  /**
   * Calculate volume trend (increasing or decreasing)
   */
  private calculateVolumeTrend(candles: Candle[]): number {
    const recentCandles = candles.slice(-this.lookbackPeriod);
    const olderCandles = candles.slice(-this.lookbackPeriod * 2, -this.lookbackPeriod);
    
    const recentVolume = recentCandles.reduce((sum, candle) => sum + candle.volume, 0);
    const olderVolume = olderCandles.reduce((sum, candle) => sum + candle.volume, 0);
    
    return olderVolume > 0 ? recentVolume / olderVolume : 1;
  }
}
