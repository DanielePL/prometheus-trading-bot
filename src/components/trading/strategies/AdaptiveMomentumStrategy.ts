
import { TradingStrategy, TradingSignal, Candle, OrderBook } from '../TradingBotAPI';

export class AdaptiveMomentumStrategy implements TradingStrategy {
  private momPeriod: number = 14;
  private volLookback: number = 30;
  private adxThreshold: number = 25; // Threshold for trend strength
  private adaptiveFactorMax: number = 1.5; // Maximum adaptation for volatile markets
  private adaptiveFactorMin: number = 0.5; // Minimum adaptation for low volatility

  getName(): string {
    return "Adaptive Momentum";
  }

  analyze(candles: Candle[], orderBook: OrderBook, symbol?: string): TradingSignal {
    if (candles.length < Math.max(this.momPeriod, this.volLookback) + 10) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for proper momentum analysis'
      };
    }
    
    // Calculate market volatility to determine adaptive parameters
    const volatility = this.calculateVolatility(candles, this.volLookback);
    const adaptiveFactor = this.calculateAdaptiveFactor(volatility);
    
    // Calculate momentum
    const momentum = this.calculateMomentum(candles, Math.round(this.momPeriod * adaptiveFactor));
    
    // Calculate trend strength using ADX-like approach
    const trendStrength = this.calculateTrendStrength(candles, 14);
    
    // Current price and previous prices
    const currentPrice = candles[candles.length - 1].close;
    const prevPrice = candles[candles.length - 2].close;
    
    // Get volume profile from order book
    const volumeProfile = this.analyzeOrderBookVolume(orderBook);
    
    // Analyze price action patterns
    const patterns = this.analyzePricePatterns(candles);
    
    // Strong momentum with trend confirmation
    if (momentum > 0.02 * adaptiveFactor && trendStrength > this.adxThreshold) {
      const confidence = Math.min(0.85, 0.5 + momentum * 10 + (trendStrength / 100) * 0.3);
      
      // Enhanced confidence if volume supports the movement
      const volumeConfidence = volumeProfile.buyPressure > volumeProfile.sellPressure ? 0.1 : -0.05;
      
      return {
        action: 'buy',
        confidence: Math.min(0.9, confidence + volumeConfidence),
        targetPrice: currentPrice * (1 + 0.03 * adaptiveFactor),
        stopLoss: currentPrice * (1 - 0.02 * adaptiveFactor),
        reason: `Strong momentum with trend confirmation (Strength: ${trendStrength.toFixed(1)}, Momentum: ${(momentum * 100).toFixed(2)}%, Adaptive: ${adaptiveFactor.toFixed(2)})`
      };
    }
    
    // Negative momentum with trend confirmation
    if (momentum < -0.02 * adaptiveFactor && trendStrength > this.adxThreshold) {
      const confidence = Math.min(0.85, 0.5 + Math.abs(momentum) * 10 + (trendStrength / 100) * 0.3);
      
      // Enhanced confidence if volume supports the movement
      const volumeConfidence = volumeProfile.sellPressure > volumeProfile.buyPressure ? 0.1 : -0.05;
      
      return {
        action: 'sell',
        confidence: Math.min(0.9, confidence + volumeConfidence),
        targetPrice: currentPrice * (1 - 0.03 * adaptiveFactor),
        stopLoss: currentPrice * (1 + 0.02 * adaptiveFactor),
        reason: `Negative momentum with trend confirmation (Strength: ${trendStrength.toFixed(1)}, Momentum: ${(momentum * 100).toFixed(2)}%, Adaptive: ${adaptiveFactor.toFixed(2)})`
      };
    }
    
    // Countertrend bounce opportunity in oversold conditions
    if (momentum < -0.03 * adaptiveFactor && patterns.oversold && volumeProfile.buyPressure > volumeProfile.sellPressure * 1.2) {
      return {
        action: 'buy',
        confidence: 0.65,
        targetPrice: currentPrice * (1 + 0.025 * adaptiveFactor),
        stopLoss: currentPrice * (1 - 0.015 * adaptiveFactor),
        reason: 'Countertrend bounce opportunity: oversold with increasing buy pressure'
      };
    }
    
    // Countertrend shorting opportunity in overbought conditions
    if (momentum > 0.03 * adaptiveFactor && patterns.overbought && volumeProfile.sellPressure > volumeProfile.buyPressure * 1.2) {
      return {
        action: 'sell',
        confidence: 0.65,
        targetPrice: currentPrice * (1 - 0.025 * adaptiveFactor),
        stopLoss: currentPrice * (1 + 0.015 * adaptiveFactor),
        reason: 'Countertrend shorting opportunity: overbought with increasing sell pressure'
      };
    }
    
    // Breakout detected
    if (patterns.breakout && momentum > 0) {
      return {
        action: 'buy',
        confidence: 0.7,
        targetPrice: currentPrice * (1 + 0.04 * adaptiveFactor),
        stopLoss: patterns.breakoutLevel * 0.995,
        reason: `Breakout detected above ${patterns.breakoutLevel.toFixed(2)} with positive momentum`
      };
    }
    
    // Breakdown detected
    if (patterns.breakdown && momentum < 0) {
      return {
        action: 'sell',
        confidence: 0.7,
        targetPrice: currentPrice * (1 - 0.04 * adaptiveFactor),
        stopLoss: patterns.breakdownLevel * 1.005,
        reason: `Breakdown detected below ${patterns.breakdownLevel.toFixed(2)} with negative momentum`
      };
    }
    
    // No clear signal
    return {
      action: 'hold',
      confidence: 0.5,
      reason: `No clear momentum signal (Strength: ${trendStrength.toFixed(1)}, Momentum: ${(momentum * 100).toFixed(2)}%, Adaptive: ${adaptiveFactor.toFixed(2)})`
    };
  }
  
  // Calculate momentum as rate of change over period
  private calculateMomentum(candles: Candle[], period: number): number {
    const currentPrice = candles[candles.length - 1].close;
    const priceNPeriodsAgo = candles[candles.length - 1 - period].close;
    
    return (currentPrice - priceNPeriodsAgo) / priceNPeriodsAgo;
  }
  
  // Calculate market volatility
  private calculateVolatility(candles: Candle[], period: number): number {
    const returns: number[] = [];
    
    for (let i = 1; i < Math.min(period + 1, candles.length); i++) {
      const dailyReturn = (candles[candles.length - i].close / candles[candles.length - i - 1].close) - 1;
      returns.push(dailyReturn);
    }
    
    // Calculate standard deviation of returns
    const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    const squaredDiffs = returns.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / squaredDiffs.length;
    
    return Math.sqrt(variance);
  }
  
  // Calculate adaptive factor based on volatility
  private calculateAdaptiveFactor(volatility: number): number {
    // Scale volatility - typical daily volatility for crypto might be around 0.02-0.04 (2-4%)
    const scaledVolatility = volatility * 100; // Convert to percentage
    
    if (scaledVolatility < 2) {
      // Low volatility environment - reduce sensitivity
      return this.adaptiveFactorMin;
    } else if (scaledVolatility > 8) {
      // High volatility environment - increase sensitivity
      return this.adaptiveFactorMax;
    } else {
      // Scale linearly between min and max
      const range = this.adaptiveFactorMax - this.adaptiveFactorMin;
      const volatilityRatio = (scaledVolatility - 2) / 6; // 0-1 scale for 2-8% volatility
      return this.adaptiveFactorMin + range * volatilityRatio;
    }
  }
  
  // Calculate trend strength using ADX-like approach
  private calculateTrendStrength(candles: Candle[], period: number): number {
    if (candles.length < period + 1) return 0;
    
    let plusDM = 0;
    let minusDM = 0;
    let trSum = 0;
    
    for (let i = 1; i < period + 1; i++) {
      const high = candles[candles.length - i].high;
      const low = candles[candles.length - i].low;
      const prevHigh = candles[candles.length - i - 1].high;
      const prevLow = candles[candles.length - i - 1].low;
      
      // Calculate directional movement
      const upMove = high - prevHigh;
      const downMove = prevLow - low;
      
      // Plus Directional Movement
      if (upMove > downMove && upMove > 0) {
        plusDM += upMove;
      }
      
      // Minus Directional Movement
      if (downMove > upMove && downMove > 0) {
        minusDM += downMove;
      }
      
      // True Range
      const tr1 = high - low;
      const tr2 = Math.abs(high - candles[candles.length - i - 1].close);
      const tr3 = Math.abs(low - candles[candles.length - i - 1].close);
      trSum += Math.max(tr1, tr2, tr3);
    }
    
    if (trSum === 0) return 0;
    
    // Directional Indicators
    const plusDI = (plusDM / trSum) * 100;
    const minusDI = (minusDM / trSum) * 100;
    
    // Directional Index
    const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    
    return dx;
  }
  
  // Analyze order book to determine buying vs selling pressure
  private analyzeOrderBookVolume(orderBook: OrderBook): { buyPressure: number, sellPressure: number } {
    if (!orderBook || !orderBook.bids || !orderBook.asks) {
      return { buyPressure: 1, sellPressure: 1 };
    }
    
    // Calculate total volume of bids and asks within 2% of midpoint
    const bids = orderBook.bids;
    const asks = orderBook.asks;
    
    if (bids.length === 0 || asks.length === 0) {
      return { buyPressure: 1, sellPressure: 1 };
    }
    
    // Calculate midpoint price
    const topBidPrice = bids[0][0];
    const topAskPrice = asks[0][0];
    const midPoint = (topBidPrice + topAskPrice) / 2;
    
    // Calculate buying and selling pressure (volume within 2% of midpoint)
    let buyVolume = 0;
    let sellVolume = 0;
    
    // Calculate buy volume (bids)
    for (const [price, volume] of bids) {
      if (price >= midPoint * 0.98) {
        buyVolume += volume;
      }
    }
    
    // Calculate sell volume (asks)
    for (const [price, volume] of asks) {
      if (price <= midPoint * 1.02) {
        sellVolume += volume;
      }
    }
    
    return {
      buyPressure: buyVolume,
      sellPressure: sellVolume
    };
  }
  
  // Analyze price patterns
  private analyzePricePatterns(candles: Candle[]): {
    overbought: boolean,
    oversold: boolean,
    breakout: boolean,
    breakdown: boolean,
    breakoutLevel?: number,
    breakdownLevel?: number
  } {
    const result = {
      overbought: false,
      oversold: false,
      breakout: false,
      breakdown: false,
      breakoutLevel: 0,
      breakdownLevel: 0
    };
    
    if (candles.length < 20) return result;
    
    // Recent prices
    const prices = candles.slice(-20).map(c => c.close);
    const highs = candles.slice(-20).map(c => c.high);
    const lows = candles.slice(-20).map(c => c.low);
    const volumes = candles.slice(-20).map(c => c.volume);
    
    // Current and previous candles
    const current = candles[candles.length - 1];
    const prev1 = candles[candles.length - 2];
    const prev2 = candles[candles.length - 3];
    
    // Calculate RSI-like indicator for overbought/oversold
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change >= 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }
    
    const avgGain = gains.reduce((sum, val) => sum + val, 0) / gains.length;
    const avgLoss = losses.reduce((sum, val) => sum + val, 0) / losses.length;
    
    const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
    const rsi = 100 - (100 / (1 + rs));
    
    // Check for overbought/oversold conditions
    result.overbought = rsi > 70;
    result.oversold = rsi < 30;
    
    // Find potential resistance level
    const recentHighs = highs.slice(-10);
    const maxHigh = Math.max(...recentHighs);
    const highCounts = recentHighs.filter(h => h >= maxHigh * 0.98 && h <= maxHigh * 1.02).length;
    
    // Resistance level that has been tested multiple times
    if (highCounts >= 3) {
      result.breakoutLevel = maxHigh;
      
      // Check if current price broke above resistance with volume
      if (current.close > maxHigh && current.volume > prev1.volume * 1.2) {
        result.breakout = true;
      }
    }
    
    // Find potential support level
    const recentLows = lows.slice(-10);
    const minLow = Math.min(...recentLows);
    const lowCounts = recentLows.filter(l => l >= minLow * 0.98 && l <= minLow * 1.02).length;
    
    // Support level that has been tested multiple times
    if (lowCounts >= 3) {
      result.breakdownLevel = minLow;
      
      // Check if current price broke below support with volume
      if (current.close < minLow && current.volume > prev1.volume * 1.2) {
        result.breakdown = true;
      }
    }
    
    return result;
  }
}
