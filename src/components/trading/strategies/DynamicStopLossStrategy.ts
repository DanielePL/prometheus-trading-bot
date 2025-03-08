import { TradingStrategy, TradingSignal, Candle, OrderBook } from '../TradingBotAPI';
import { BullRunParameters, MarketAnalysisReport } from '../../dashboard/BullRunDetector';

export class DynamicStopLossStrategy implements TradingStrategy {
  private volatilityMultiplier: number = 2.0;
  private atrPeriod: number = 14;
  private bullRunConfidence: number = 0;
  private lastBullRun: Date | null = null;
  private marketReport: MarketAnalysisReport | null = null;

  constructor() {
    // Initialize bull run data from local storage if available
    try {
      const storedData = localStorage.getItem('bull_run_data');
      if (storedData) {
        const { confidence, timestamp } = JSON.parse(storedData);
        this.bullRunConfidence = confidence || 0;
        this.lastBullRun = timestamp ? new Date(timestamp) : null;
      }
      
      // Load market analysis report if available
      const storedReport = localStorage.getItem('market_analysis_report');
      if (storedReport) {
        this.marketReport = JSON.parse(storedReport);
      }
    } catch (error) {
      console.error('Error loading bull run data:', error);
    }
  }

  getName(): string {
    return "Dynamic Stop Loss with Market Analysis";
  }

  // Allow updating the bull run parameters from external components
  updateBullRunData(params: BullRunParameters): void {
    this.bullRunConfidence = params.confidence;
    this.lastBullRun = new Date();
    
    // Store bull run data in local storage for persistence
    localStorage.setItem('bull_run_data', JSON.stringify({
      confidence: this.bullRunConfidence,
      timestamp: this.lastBullRun.toISOString()
    }));
  }
  
  // Allow updating the market analysis report from external components
  updateMarketReport(report: MarketAnalysisReport): void {
    this.marketReport = report;
  }

  analyze(candles: Candle[], orderBook: OrderBook, symbol?: string): TradingSignal {
    if (candles.length < this.atrPeriod + 1) {
      return {
        action: 'hold',
        confidence: 0,
        reason: 'Not enough data for proper analysis'
      };
    }
    
    // Calculate Average True Range (ATR) for volatility measurement
    const atr = this.calculateATR(candles, this.atrPeriod);
    
    // Calculate various price levels
    const currentPrice = candles[candles.length - 1].close;
    const previousClose = candles[candles.length - 2].close;
    const priceChange = (currentPrice - previousClose) / previousClose;
    
    // Calculate key support and resistance levels
    const pivotPoints = this.calculatePivotPoints(candles);
    const { supportLevels, resistanceLevels } = pivotPoints;
    
    // Calculate moving averages for trend identification
    const sma20 = this.calculateSMA(candles, 20);
    const sma50 = this.calculateSMA(candles, 50);
    const sma200 = this.calculateSMA(candles, 200);
    
    // Check for volume confirmation
    const volumeRatio = this.calculateVolumeRatio(candles, 5);
    
    // Determine trend strength
    const trendStrength = this.calculateTrendStrength(candles);
    
    // Incorporate bull run confidence into the strategy
    let bullRunFactor = 0;
    if (this.bullRunConfidence > 0) {
      // Check if bull run detection is recent (within the last 24 hours)
      const isRecent = this.lastBullRun && 
                       (new Date().getTime() - this.lastBullRun.getTime()) < 24 * 60 * 60 * 1000;
      
      bullRunFactor = isRecent ? this.bullRunConfidence : 0;
    }
    
    // Incorporate market report data if available and the symbol is provided
    let marketReportBoost = 0;
    if (this.marketReport && symbol) {
      const coinSymbol = symbol.split('-')[0]; // Extract coin symbol from trading pair
      
      // Check if the coin is in tier 1, tier 2, or tier 3
      if (this.marketReport.tierOneCoins.includes(coinSymbol)) {
        marketReportBoost = 0.15; // High confidence boost
      } else if (this.marketReport.tierTwoCoins.includes(coinSymbol)) {
        marketReportBoost = 0.1; // Medium confidence boost
      } else if (this.marketReport.tierThreeCoins.includes(coinSymbol)) {
        marketReportBoost = 0.05; // Low confidence boost
      }
      
      // Additional boost for breakout coins
      if (this.marketReport.breakoutCoins.includes(coinSymbol)) {
        marketReportBoost += 0.05;
      }
      
      // Adjust boost based on overall market sentiment
      if (this.marketReport.marketSentiment === 'bullish') {
        marketReportBoost *= 1.2;
      } else if (this.marketReport.marketSentiment === 'bearish') {
        marketReportBoost *= 0.8;
      }
    }
    
    // Dynamic stop loss calculation based on ATR and bull run factor
    const baseStopLossPercentage = atr / currentPrice * 100;
    const adjustedStopLossPercentage = bullRunFactor > 0.5 
      ? baseStopLossPercentage * (1 - bullRunFactor * 0.4) // Tighter stop loss during bull runs
      : baseStopLossPercentage;
    
    // Combine all factors to make a decision
    
    // Strong uptrend with volume confirmation and bull run
    if (sma20 > sma50 && sma50 > sma200 && volumeRatio > 1.2 && (bullRunFactor > 0.6 || marketReportBoost > 0.1)) {
      const nearestResistance = resistanceLevels.find(r => r > currentPrice) || currentPrice * 1.05;
      const stopLoss = currentPrice * (1 - adjustedStopLossPercentage / 100);
      
      return {
        action: 'buy',
        confidence: Math.min(0.8 + bullRunFactor * 0.2 + marketReportBoost, 0.95),
        targetPrice: nearestResistance,
        stopLoss,
        reason: `Strong uptrend with volume confirmation${bullRunFactor > 0 ? ', bull run pattern' : ''}${marketReportBoost > 0 ? ' and positive market analysis' : ''}`
      };
    }
    
    // Strong downtrend with increasing volume
    if (sma20 < sma50 && sma50 < sma200 && volumeRatio > 1.5) {
      const nearestSupport = supportLevels.find(s => s < currentPrice) || currentPrice * 0.95;
      const stopLoss = currentPrice * (1 + adjustedStopLossPercentage / 100);
      
      return {
        action: 'sell',
        confidence: 0.7,
        targetPrice: nearestSupport,
        stopLoss,
        reason: 'Strong downtrend with increasing volume'
      };
    }
    
    // Breakout from range with volume surge during bull run
    if (trendStrength < 0.3 && priceChange > 0.02 && volumeRatio > 2 && (bullRunFactor > 0.7 || marketReportBoost > 0.1)) {
      const stopLoss = currentPrice * (1 - adjustedStopLossPercentage / 100);
      
      return {
        action: 'buy',
        confidence: 0.75 + marketReportBoost,
        targetPrice: currentPrice * 1.1,
        stopLoss,
        reason: `Breakout from range with volume surge${marketReportBoost > 0 ? ' and positive market analysis' : ''}`
      };
    }
    
    // Pullback to support in uptrend
    if (sma20 > sma50 && currentPrice < sma20 && 
        supportLevels.some(s => Math.abs(s - currentPrice) / currentPrice < 0.01)) {
      const stopLoss = currentPrice * (1 - adjustedStopLossPercentage / 100);
      
      return {
        action: 'buy',
        confidence: 0.6 + marketReportBoost,
        targetPrice: sma20 * 1.02,
        stopLoss,
        reason: 'Pullback to support in overall uptrend'
      };
    }
    
    // Bounce from support during bull run or for tier 1/2 coins
    if ((bullRunFactor > 0.6 || marketReportBoost > 0.1) && 
        supportLevels.some(s => Math.abs(s - currentPrice) / currentPrice < 0.01)) {
      const stopLoss = currentPrice * (1 - adjustedStopLossPercentage / 100);
      
      return {
        action: 'buy',
        confidence: 0.7 + marketReportBoost,
        targetPrice: currentPrice * 1.05,
        stopLoss,
        reason: `Bounce from support during${bullRunFactor > 0.6 ? ' bull run phase' : ''}${marketReportBoost > 0 ? ' for highly rated coin' : ''}`
      };
    }
    
    // No clear signal
    return {
      action: 'hold',
      confidence: 0.5,
      reason: 'No clear trading signal based on current market conditions'
    };
  }
  
  // Calculate Average True Range (ATR)
  private calculateATR(candles: Candle[], period: number): number {
    if (candles.length < period + 1) return 0;
    
    const trs: number[] = [];
    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;
      
      const tr1 = high - low;
      const tr2 = Math.abs(high - prevClose);
      const tr3 = Math.abs(low - prevClose);
      
      trs.push(Math.max(tr1, tr2, tr3));
    }
    
    // Calculate the ATR as an average of the last 'period' true ranges
    const relevantTRs = trs.slice(-period);
    const sum = relevantTRs.reduce((acc, val) => acc + val, 0);
    return sum / relevantTRs.length;
  }
  
  // Calculate Simple Moving Average
  private calculateSMA(candles: Candle[], period: number): number {
    if (candles.length < period) return 0;
    
    const relevantCandles = candles.slice(-period);
    const sum = relevantCandles.reduce((acc, candle) => acc + candle.close, 0);
    return sum / relevantCandles.length;
  }
  
  // Calculate pivot points, support and resistance levels
  private calculatePivotPoints(candles: Candle[]): { pivotPoint: number, supportLevels: number[], resistanceLevels: number[] } {
    // Use the most recent complete candle for calculations
    const lastCandle = candles[candles.length - 1];
    const high = lastCandle.high;
    const low = lastCandle.low;
    const close = lastCandle.close;
    
    // Calculate the pivot point
    const pivotPoint = (high + low + close) / 3;
    
    // Calculate support levels
    const s1 = 2 * pivotPoint - high;
    const s2 = pivotPoint - (high - low);
    const s3 = low - 2 * (high - pivotPoint);
    
    // Calculate resistance levels
    const r1 = 2 * pivotPoint - low;
    const r2 = pivotPoint + (high - low);
    const r3 = high + 2 * (pivotPoint - low);
    
    return {
      pivotPoint,
      supportLevels: [s1, s2, s3],
      resistanceLevels: [r1, r2, r3]
    };
  }
  
  // Calculate volume ratio compared to average
  private calculateVolumeRatio(candles: Candle[], period: number): number {
    if (candles.length < period + 1) return 1;
    
    const currentVolume = candles[candles.length - 1].volume;
    const previousVolumes = candles.slice(-period - 1, -1);
    const avgVolume = previousVolumes.reduce((acc, candle) => acc + candle.volume, 0) / previousVolumes.length;
    
    return avgVolume > 0 ? currentVolume / avgVolume : 1;
  }
  
  // Calculate trend strength using ADX-like approach
  private calculateTrendStrength(candles: Candle[]): number {
    if (candles.length < 14) return 0.5;
    
    // Simplified trend strength calculation
    const closes = candles.map(c => c.close);
    let upMoves = 0;
    let downMoves = 0;
    
    for (let i = 1; i < closes.length; i++) {
      if (closes[i] > closes[i - 1]) {
        upMoves++;
      } else if (closes[i] < closes[i - 1]) {
        downMoves++;
      }
    }
    
    const totalMoves = upMoves + downMoves;
    if (totalMoves === 0) return 0.5;
    
    // Calculate directional strength
    const upStrength = upMoves / totalMoves;
    const downStrength = downMoves / totalMoves;
    
    // Return trend strength (0 = no trend, 1 = very strong trend)
    return Math.abs(upStrength - downStrength);
  }
}
