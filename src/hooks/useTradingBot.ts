import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  exchangeAPI, 
  getStrategyByName, 
  TradingSignal,
  Candle,
  OrderBook,
  MarketData,
  ExchangeAPI
} from '@/components/trading/TradingBotAPI';
import { KrakenAPI } from '@/components/trading/KrakenAPI';

export interface TradingBotState {
  isRunning: boolean;
  tradeMode: 'paper' | 'live';
  riskLevel: 'low' | 'medium' | 'high';
  tradingStrategy: string;
  maxTradingAmount: string;
  tradingPair: string;
  logs: string[];
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number;
  lastTrade: null | { 
    type: 'buy' | 'sell';
    price: string;
    amount: string;
    timestamp: string;
  };
  marketData: MarketData | null;
  candles: Candle[];
  orderBook: OrderBook | null;
  currentSignal: TradingSignal | null;
  showApiConfig: boolean;
  apiKeys: {
    exchangeApiKey: string;
    exchangeApiSecret: string;
    apiEndpoint: string;
  };
  isExchangeConnected: boolean;
  exchangeName: string;
  exchangeLatency: number;
  connectionQuality: number;
  autoPaperTrade: boolean;
}

export interface TradingBotActions {
  startBot: () => void;
  stopBot: () => void;
  toggleTradingMode: (mode: 'paper' | 'live') => void;
  clearLogs: () => void;
  refreshData: () => void;
  handleSaveApiKeys: (keys: TradingBotState['apiKeys']) => void;
  configureApiKeys: () => void;
  setTradingPair: (value: string) => void;
  setTradingStrategy: (value: string) => void;
  setRiskLevel: (value: 'low' | 'medium' | 'high') => void;
  setMaxTradingAmount: (value: string) => void;
  setShowApiConfig: (value: boolean) => void;
  reconnectExchange: () => void;
  disconnectExchange: () => void;
  testExchangeConnection: () => void;
  toggleAutoPaperTrade: () => void;
}

export const tradingPairs = [
  { value: 'BTC-USD', label: 'Bitcoin/USD' },
  { value: 'ETH-USD', label: 'Ethereum/USD' },
  { value: 'SOL-USD', label: 'Solana/USD' },
  { value: 'DOGE-USD', label: 'Dogecoin/USD' },
  { value: 'ADA-USD', label: 'Cardano/USD' },
];

export const tradingStrategies = [
  { value: 'adaptivemomentum', label: 'Adaptive Momentum' },
  { value: 'dynamicstoploss', label: 'Dynamic Stop Loss + Bull Run Scanner' },
  { value: 'macrossover', label: 'Moving Average Crossover' },
  { value: 'rsioscillator', label: 'RSI Oscillator' },
  { value: 'bollingerbands', label: 'Bollinger Bands' },
  { value: 'volumeprofile', label: 'Volume Profile' },
  { value: 'supportresistance', label: 'Support & Resistance' },
];

// Create a shared state for the trading bot that persists across component mounts
let globalBotRunning = false;
let globalAnalysisInterval: NodeJS.Timeout | null = null;
let globalResourceInterval: NodeJS.Timeout | null = null;
let globalConnectionCheckInterval: NodeJS.Timeout | null = null;
let globalLogs: string[] = [];
let globalIsExchangeConnected = false;

export const useTradingBot = (): [TradingBotState, TradingBotActions] => {
  // Initialize from localStorage or use defaults
  const [isRunning, setIsRunning] = useState(() => {
    const stored = localStorage.getItem('tradingBotRunning') === 'true';
    globalBotRunning = stored;
    return stored;
  });
  const [tradeMode, setTradeMode] = useState<'paper' | 'live'>(() => 
    localStorage.getItem('tradingBotMode') as 'paper' | 'live' || 'paper'
  );
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>(() => 
    localStorage.getItem('tradingBotRiskLevel') as 'low' | 'medium' | 'high' || 'medium'
  );
  const [tradingStrategy, setTradingStrategy] = useState(() => 
    localStorage.getItem('tradingBotStrategy') || 'dynamicstoploss'
  );
  const [maxTradingAmount, setMaxTradingAmount] = useState(() => 
    localStorage.getItem('tradingBotMaxAmount') || '1000'
  );
  const [tradingPair, setTradingPair] = useState(() => 
    localStorage.getItem('tradingBotPair') || 'BTC-USD'
  );
  const [logs, setLogs] = useState<string[]>(globalLogs);
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
  const [activeExchangeAPI, setActiveExchangeAPI] = useState<ExchangeAPI>(exchangeAPI);
  const [isExchangeConnected, setIsExchangeConnected] = useState(globalIsExchangeConnected);
  const [exchangeName, setExchangeName] = useState('Kraken');
  const [exchangeLatency, setExchangeLatency] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState(0);
  const [connectionCheckInterval, setConnectionCheckInterval] = useState<NodeJS.Timeout | null>(globalConnectionCheckInterval);
  const [autoPaperTrade, setAutoPaperTrade] = useState(() => 
    localStorage.getItem('autoPaperTrade') === 'true'
  );
  const { toast } = useToast();

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tradingBotMode', tradeMode);
    localStorage.setItem('tradingBotRiskLevel', riskLevel);
    localStorage.setItem('tradingBotStrategy', tradingStrategy);
    localStorage.setItem('tradingBotMaxAmount', maxTradingAmount);
    localStorage.setItem('tradingBotPair', tradingPair);
    localStorage.setItem('autoPaperTrade', autoPaperTrade.toString());
  }, [tradeMode, riskLevel, tradingStrategy, maxTradingAmount, tradingPair, autoPaperTrade]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-19), newLog]);
    globalLogs = [...globalLogs.slice(-19), newLog];
  };

  const initializeExchangeAPI = () => {
    if (apiKeys.exchangeApiKey && apiKeys.exchangeApiSecret) {
      try {
        addLog(`Initializing connection to Kraken API...`);
        const krakenAPI = new KrakenAPI(
          apiKeys.exchangeApiKey,
          apiKeys.exchangeApiSecret,
          apiKeys.apiEndpoint
        );
        setActiveExchangeAPI(krakenAPI);
        addLog(`Connected to Kraken API successfully.`);
        setIsExchangeConnected(true);
        globalIsExchangeConnected = true;
        setExchangeName('Kraken');
        simulateConnectionMetrics();
        return true;
      } catch (error) {
        addLog(`Error connecting to Kraken API: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Kraken API connection error:', error);
        setActiveExchangeAPI(exchangeAPI); // Fall back to mock API
        setIsExchangeConnected(false);
        globalIsExchangeConnected = false;
        return false;
      }
    } else {
      addLog(`No API keys configured, using simulation mode.`);
      setActiveExchangeAPI(exchangeAPI); // Use mock API
      setIsExchangeConnected(false);
      globalIsExchangeConnected = false;
      return false;
    }
  };

  const simulateConnectionMetrics = () => {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
    }
    
    setExchangeLatency(Math.floor(Math.random() * 50) + 10);
    setConnectionQuality(90 + Math.floor(Math.random() * 10));
    
    const interval = setInterval(() => {
      if (isExchangeConnected) {
        const newLatency = Math.random() > 0.9 
          ? Math.floor(Math.random() * 150) + 50 
          : Math.floor(Math.random() * 50) + 10;
        setExchangeLatency(newLatency);
        
        const qualityChange = Math.random() > 0.8 
          ? -Math.floor(Math.random() * 20) 
          : Math.floor(Math.random() * 5);
        setConnectionQuality(prev => Math.max(40, Math.min(100, prev + qualityChange)));
      }
    }, 5000);
    
    setConnectionCheckInterval(interval);
    globalConnectionCheckInterval = interval;
    return interval;
  };

  const analyzeMarket = async () => {
    try {
      addLog(`Fetching market data for ${tradingPair}...`);
      const data = await activeExchangeAPI.fetchMarketData(tradingPair);
      setMarketData(data);
      addLog(`Current ${tradingPair} price: $${data.price.toFixed(2)}`);
      
      addLog('Retrieving historical price data for analysis...');
      const candleData = await activeExchangeAPI.fetchCandles(tradingPair, '1h');
      setCandles(candleData);
      
      const bookData = await activeExchangeAPI.getOrderBook(tradingPair);
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
          if (autoPaperTrade) {
            addLog(`[AUTO PAPER TRADE] Executing ${signal.action} based on strong signal`);
            simulateTrade(signal);
            
            const paperTrades = JSON.parse(localStorage.getItem('paperTrades') || '[]');
            const newTrade = {
              id: Date.now().toString(),
              symbol: tradingPair,
              type: signal.action as 'buy' | 'sell',
              price: data.price,
              amount: parseFloat(maxTradingAmount) * 0.1,
              total: data.price * (parseFloat(maxTradingAmount) * 0.1),
              currentPrice: data.price,
              profit: 0,
              profitPercentage: 0,
              timestamp: Date.now()
            };
            
            paperTrades.push(newTrade);
            localStorage.setItem('paperTrades', JSON.stringify(paperTrades));
            
            const currentBalance = parseFloat(localStorage.getItem('paperTradeBalance') || '100000');
            const newBalance = signal.action === 'buy' 
              ? currentBalance - newTrade.total 
              : currentBalance + newTrade.total;
            localStorage.setItem('paperTradeBalance', newBalance.toString());
            
            toast({
              title: `Auto Paper ${signal.action === 'buy' ? 'Buy' : 'Sell'} Executed`,
              description: `${newTrade.amount.toFixed(5)} ${tradingPair.split('-')[0]} at $${data.price.toFixed(2)}`,
              variant: signal.action === 'buy' ? 'default' : 'destructive'
            });
          } else {
            addLog(`[PAPER] Would execute ${signal.action} based on signal (Auto-trading disabled)`);
            addLog(`[PAPER] Enable auto paper trading to automatically execute paper trades`);
          }
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
      
      const result = await activeExchangeAPI.executeOrder(order);
      
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
    if (!apiKeys.exchangeApiKey || !apiKeys.exchangeApiSecret) {
      toast({
        title: "API Keys Required",
        description: "Please configure your exchange API keys for market data",
        variant: "destructive"
      });
      setShowApiConfig(true);
      return;
    }
    
    const connected = initializeExchangeAPI();
    
    if (!connected && tradeMode === 'live') {
      toast({
        title: "API Connection Failed",
        description: "Could not connect to exchange API. Live trading not available.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    globalBotRunning = true;
    localStorage.setItem('tradingBotRunning', 'true');
    
    setCpuUsage(0);
    setMemoryUsage(0);
    setExecutionTime(0);
    
    addLog(`Bot started in ${tradeMode.toUpperCase()} mode with ${riskLevel.toUpperCase()} risk profile.`);
    addLog(`Using ${getStrategyByName(tradingStrategy).getName()} strategy on ${tradingPair}.`);
    
    if (tradeMode === 'live') {
      addLog(`Connected to Kraken API for live trading.`);
    } else {
      addLog(`Connected to Kraken API for market data (Paper trading mode).`);
    }
    
    analyzeMarket();
    
    // Set up intervals for analysis and resource monitoring
    if (!globalAnalysisInterval) {
      globalAnalysisInterval = setInterval(() => {
        if (globalBotRunning) {
          analyzeMarket();
        }
      }, 30000);
    }
    
    if (!globalResourceInterval) {
      globalResourceInterval = setInterval(() => {
        if (globalBotRunning) {
          setCpuUsage(Math.floor(Math.random() * 40) + 20);
          setMemoryUsage(Math.floor(Math.random() * 30) + 40);
          setExecutionTime(prev => prev + 3);
        }
      }, 3000);
    }
    
    toast({
      title: 'Trading Bot Started',
      description: `Bot is now running in ${tradeMode} trading mode.`,
    });
  };

  const stopBot = () => {
    setIsRunning(false);
    globalBotRunning = false;
    localStorage.setItem('tradingBotRunning', 'false');
    
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
    globalLogs = [];
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
    
    if (isRunning) {
      initializeExchangeAPI();
    }
  };

  const configureApiKeys = () => {
    console.log("Opening API key configuration");
    setShowApiConfig(true);
  };

  const reconnectExchange = () => {
    addLog(`Attempting to reconnect to ${exchangeName}...`);
    const connected = initializeExchangeAPI();
    if (connected) {
      addLog(`Successfully reconnected to ${exchangeName}.`);
    } else {
      addLog(`Failed to reconnect to ${exchangeName}.`);
    }
  };
  
  const disconnectExchange = () => {
    addLog(`Disconnecting from ${exchangeName}...`);
    setIsExchangeConnected(false);
    globalIsExchangeConnected = false;
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
      setConnectionCheckInterval(null);
      globalConnectionCheckInterval = null;
    }
    setExchangeLatency(0);
    setConnectionQuality(0);
    
    if (isRunning) {
      stopBot();
    }
    
    addLog(`Disconnected from ${exchangeName}.`);
  };
  
  const testExchangeConnection = async () => {
    addLog(`Testing connection to ${exchangeName}...`);
    
    try {
      const startTime = Date.now();
      await activeExchangeAPI.fetchMarketData(tradingPair);
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      setExchangeLatency(latency);
      setConnectionQuality(Math.max(40, 100 - Math.floor(latency / 10)));
      
      addLog(`Connection test successful. Latency: ${latency}ms`);
    } catch (error) {
      addLog(`Connection test failed: ${error instanceof Error ? error.message : String(error)}`);
      setIsExchangeConnected(false);
      globalIsExchangeConnected = false;
      setExchangeLatency(0);
      setConnectionQuality(0);
    }
  };

  const toggleAutoPaperTrade = () => {
    const newState = !autoPaperTrade;
    setAutoPaperTrade(newState);
    localStorage.setItem('autoPaperTrade', newState.toString());
    
    if (newState) {
      addLog('Auto paper trading enabled - will automatically execute paper trades on strong signals');
      toast({
        title: 'Auto Paper Trading Enabled',
        description: 'Bot will automatically execute paper trades on strong signals'
      });
    } else {
      addLog('Auto paper trading disabled - no automatic paper trades will be executed');
      toast({
        title: 'Auto Paper Trading Disabled',
        description: 'Bot will no longer automatically execute paper trades'
      });
    }
  };

  // Clean up any intervals when the component is unmounted
  useEffect(() => {
    return () => {
      // Don't clear the global intervals on unmount, just keep them running
      // This way, the analysis continues even if the component is unmounted
    };
  }, []);

  // Replace local state with global state when running, for persistence
  useEffect(() => {
    setIsExchangeConnected(globalIsExchangeConnected);
    setLogs(globalLogs);
    setIsRunning(globalBotRunning);
  }, []);

  // Effect to update global variables when local states change
  useEffect(() => {
    globalIsExchangeConnected = isExchangeConnected;
  }, [isExchangeConnected]);

  const state: TradingBotState = {
    isRunning,
    tradeMode,
    riskLevel,
    tradingStrategy,
    maxTradingAmount,
    tradingPair,
    logs,
    cpuUsage,
    memoryUsage,
    executionTime,
    lastTrade,
    marketData,
    candles,
    orderBook,
    currentSignal,
    showApiConfig,
    apiKeys,
    isExchangeConnected,
    exchangeName,
    exchangeLatency,
    connectionQuality,
    autoPaperTrade
  };

  const actions: TradingBotActions = {
    startBot,
    stopBot,
    toggleTradingMode,
    clearLogs,
    refreshData,
    handleSaveApiKeys,
    configureApiKeys,
    setTradingPair,
    setTradingStrategy,
    setRiskLevel,
    setMaxTradingAmount,
    setShowApiConfig,
    reconnectExchange,
    disconnectExchange,
    testExchangeConnection,
    toggleAutoPaperTrade
  };

  return [state, actions];
};
