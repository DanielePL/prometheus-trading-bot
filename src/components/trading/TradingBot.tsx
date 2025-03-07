
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BotControlPanel } from './BotControlPanel';
import { BotLogPanel } from './BotLogPanel';
import { ApiKeyConfig } from './ApiKeyConfig';
import { 
  exchangeAPI, 
  getStrategyByName, 
  TradingSignal,
  Candle,
  OrderBook,
  MarketData
} from './TradingBotAPI';

export const TradingBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tradeMode, setTradeMode] = useState<'paper' | 'live'>('paper');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [tradingStrategy, setTradingStrategy] = useState('macrossover');
  const [maxTradingAmount, setMaxTradingAmount] = useState('1000');
  const [tradingPair, setTradingPair] = useState('BTC-USD');
  const [logs, setLogs] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [lastTrade, setLastTrade] = useState<null | { type: 'buy' | 'sell', price: string, amount: string, timestamp: string }>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    exchangeApiKey: localStorage.getItem('exchangeApiKey') || '',
    exchangeApiSecret: localStorage.getItem('exchangeApiSecret') || '',
    apiEndpoint: localStorage.getItem('apiEndpoint') || 'https://api.exchange.com'
  });
  const { toast } = useToast();

  const tradingPairs = [
    { value: 'BTC-USD', label: 'Bitcoin/USD' },
    { value: 'ETH-USD', label: 'Ethereum/USD' },
    { value: 'SOL-USD', label: 'Solana/USD' },
    { value: 'DOGE-USD', label: 'Dogecoin/USD' },
    { value: 'ADA-USD', label: 'Cardano/USD' },
  ];

  const tradingStrategies = [
    { value: 'macrossover', label: 'Moving Average Crossover' },
    { value: 'rsioscillator', label: 'RSI Oscillator' },
    { value: 'bollingerbands', label: 'Bollinger Bands' },
    { value: 'volumeprofile', label: 'Volume Profile' },
    { value: 'supportresistance', label: 'Support & Resistance' },
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  const analyzeMarket = async () => {
    try {
      addLog(`Fetching market data for ${tradingPair}...`);
      const data = await exchangeAPI.fetchMarketData(tradingPair);
      setMarketData(data);
      addLog(`Current ${tradingPair} price: $${data.price.toFixed(2)}`);
      
      addLog('Retrieving historical price data for analysis...');
      const candleData = await exchangeAPI.fetchCandles(tradingPair, '1h');
      setCandles(candleData);
      
      const bookData = await exchangeAPI.getOrderBook(tradingPair);
      setOrderBook(bookData);
      addLog(`Order book depth: ${bookData.bids.length} bids, ${bookData.asks.length} asks`);
      
      const strategy = getStrategyByName(tradingStrategy);
      addLog(`Analyzing market with ${strategy.getName()} strategy...`);
      
      const signal = strategy.analyze(candleData, bookData);
      setCurrentSignal(signal);
      
      addLog(`Signal generated: ${signal.action.toUpperCase()} with ${(signal.confidence * 100).toFixed(0)}% confidence`);
      addLog(`Analysis: ${signal.reason}`);
      
      if (isRunning && signal.confidence > getRiskThreshold() && signal.action !== 'hold') {
        if (tradeMode === 'live') {
          await executeTrade(signal);
        } else {
          addLog(`[PAPER] Would execute ${signal.action} based on signal (Paper Trading Mode)`);
          simulateTrade(signal);
        }
      }
    } catch (error) {
      addLog(`Error analyzing market: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Market analysis error:', error);
    }
  };

  const getRiskThreshold = () => {
    switch (riskLevel) {
      case 'low': return 0.7;
      case 'medium': return 0.5;
      case 'high': return 0.3;
      default: return 0.5;
    }
  };

  const executeTrade = async (signal: TradingSignal) => {
    try {
      if (!marketData) return;
      
      const maxAmount = parseFloat(maxTradingAmount);
      const riskMultiplier = riskLevel === 'low' ? 0.25 : riskLevel === 'medium' ? 0.5 : 0.75;
      const positionSize = (maxAmount * riskMultiplier * signal.confidence) / marketData.price;
      
      addLog(`Executing ${signal.action} order for ${positionSize.toFixed(5)} ${tradingPair.split('-')[0]}...`);
      
      const order = {
        symbol: tradingPair,
        side: signal.action as 'buy' | 'sell',
        type: 'market' as 'market' | 'limit',
        quantity: positionSize
      };
      
      const result = await exchangeAPI.executeOrder(order);
      
      if (result.status === 'rejected') {
        addLog(`Order rejected: ${result.id}`);
        toast({
          title: "Order Rejected",
          description: `${signal.action.toUpperCase()} order could not be executed`,
          variant: "destructive"
        });
      } else {
        addLog(`${signal.action.toUpperCase()} order executed: ${result.filledQuantity} at $${result.price.toFixed(2)}`);
        
        setLastTrade({
          type: signal.action as 'buy' | 'sell',
          price: result.price.toFixed(2),
          amount: result.filledQuantity.toFixed(5),
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: `${signal.action === 'buy' ? 'Buy' : 'Sell'} Order Executed`,
          description: `${result.filledQuantity.toFixed(5)} ${tradingPair.split('-')[0]} at $${result.price.toFixed(2)}`,
          variant: signal.action === 'buy' ? 'default' : 'destructive'
        });
      }
    } catch (error) {
      addLog(`Error executing trade: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Trade execution error:', error);
    }
  };

  const simulateTrade = (signal: TradingSignal) => {
    if (!marketData) return;
    
    const maxAmount = parseFloat(maxTradingAmount);
    const riskMultiplier = riskLevel === 'low' ? 0.25 : riskLevel === 'medium' ? 0.5 : 0.75;
    const positionSize = (maxAmount * riskMultiplier * signal.confidence) / marketData.price;
    
    const slippage = signal.action === 'buy' ? 1.001 : 0.999;
    const price = (marketData.price * slippage).toFixed(2);
    
    setLastTrade({
      type: signal.action as 'buy' | 'sell',
      price,
      amount: positionSize.toFixed(5),
      timestamp: new Date().toISOString()
    });
    
    addLog(`[PAPER] ${signal.action.toUpperCase()} order simulated: ${positionSize.toFixed(5)} at $${price}`);
    
    toast({
      title: `Paper ${signal.action === 'buy' ? 'Buy' : 'Sell'} Simulated`,
      description: `${positionSize.toFixed(5)} ${tradingPair.split('-')[0]} at $${price}`,
      variant: signal.action === 'buy' ? 'default' : 'destructive'
    });
  };

  const startBot = () => {
    // Check for API keys regardless of trading mode
    if (!apiKeys.exchangeApiKey || !apiKeys.exchangeApiSecret) {
      toast({
        title: "API Keys Required",
        description: "Please configure your exchange API keys for market data",
        variant: "destructive"
      });
      setShowApiConfig(true);
      return;
    }
    
    setIsRunning(true);
    
    setCpuUsage(0);
    setMemoryUsage(0);
    setExecutionTime(0);
    
    addLog(`Bot started in ${tradeMode.toUpperCase()} mode with ${riskLevel.toUpperCase()} risk profile.`);
    addLog(`Using ${getStrategyByName(tradingStrategy).getName()} strategy on ${tradingPair}.`);
    addLog(`Connected to exchange API for real-time market data.`);
    
    analyzeMarket();
    
    toast({
      title: 'Trading Bot Started',
      description: `Bot is now running in ${tradeMode} trading mode.`,
    });
  };

  const stopBot = () => {
    setIsRunning(false);
    addLog('Bot stopped. Trading algorithms terminated.');
    
    toast({
      title: 'Trading Bot Stopped',
      description: 'Bot has been stopped successfully.',
    });
  };

  const toggleTradingMode = (mode: 'paper' | 'live') => {
    if (mode === 'live') {
      const confirm = window.confirm(
        'WARNING: You are switching to LIVE trading mode. Real funds will be used for trades. Are you sure you want to continue?'
      );
      if (!confirm) return;
    }
    
    setTradeMode(mode);
    addLog(`Switched to ${mode.toUpperCase()} trading mode.`);
    
    toast({
      title: 'Trading Mode Changed',
      description: `Switched to ${mode === 'paper' ? 'Paper' : 'Live'} Trading`,
      variant: mode === 'live' ? 'destructive' : 'default',
    });
  };

  const clearLogs = () => {
    setLogs([]);
    toast({ title: "Logs Cleared" });
  };

  const refreshData = () => {
    if (!isRunning) return;
    
    addLog('Executing manual market data refresh...');
    analyzeMarket();
    
    toast({
      title: "Manual Refresh",
      description: "Market data refresh initiated"
    });
  };

  const handleSaveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    localStorage.setItem('exchangeApiKey', keys.exchangeApiKey);
    localStorage.setItem('exchangeApiSecret', keys.exchangeApiSecret);
    localStorage.setItem('apiEndpoint', keys.apiEndpoint);
    
    setShowApiConfig(false);
    
    toast({
      title: "API Keys Saved",
      description: "Your exchange API configuration has been saved",
    });
    
    addLog("Exchange API configuration updated");
  };

  const configureApiKeys = () => {
    console.log("Opening API key configuration");
    setShowApiConfig(true);
  };

  useEffect(() => {
    if (!isRunning) return;
    
    const analysisInterval = setInterval(() => {
      analyzeMarket();
    }, 30000);
    
    const resourceInterval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 40) + 20);
      setMemoryUsage(Math.floor(Math.random() * 30) + 40);
      setExecutionTime(prev => prev + 3);
    }, 3000);
    
    return () => {
      clearInterval(analysisInterval);
      clearInterval(resourceInterval);
      
      if (!isRunning) {
        setCpuUsage(0);
        setMemoryUsage(0);
        setExecutionTime(0);
      }
    };
  }, [isRunning, tradingPair, riskLevel, tradingStrategy]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BotControlPanel
        isRunning={isRunning}
        tradeMode={tradeMode}
        riskLevel={riskLevel}
        tradingStrategy={tradingStrategy}
        maxTradingAmount={maxTradingAmount}
        tradingPair={tradingPair}
        cpuUsage={cpuUsage}
        memoryUsage={memoryUsage}
        executionTime={executionTime}
        lastTrade={lastTrade}
        tradingPairs={tradingPairs}
        tradingStrategies={tradingStrategies}
        onStartBot={startBot}
        onStopBot={stopBot}
        onClearLogs={clearLogs}
        onToggleTradingMode={toggleTradingMode}
        onTradingPairChange={setTradingPair}
        onTradingStrategyChange={setTradingStrategy}
        onRiskLevelChange={(val: any) => setRiskLevel(val)}
        onMaxTradingAmountChange={setMaxTradingAmount}
        onConfigureApiKeys={configureApiKeys}
        hasApiKeys={!!apiKeys.exchangeApiKey && !!apiKeys.exchangeApiSecret}
      />
      
      <BotLogPanel
        logs={logs}
        isRunning={isRunning}
        onRefreshData={refreshData}
      />

      {showApiConfig && (
        <ApiKeyConfig
          apiKeys={apiKeys}
          onSave={handleSaveApiKeys}
          onCancel={() => setShowApiConfig(false)}
        />
      )}
    </div>
  );
};
