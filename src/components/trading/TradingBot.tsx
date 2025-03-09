
import React, { useEffect } from 'react';
import { BotControlPanel } from './bot-control';
import { BotLogPanel } from './BotLogPanel';
import { ApiKeyConfig } from './ApiKeyConfig';
import { ConnectionStatusPanel } from './ConnectionStatusPanel';
import { useTradingBot, tradingPairs, tradingStrategies } from '@/hooks/useTradingBot';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const TradingBot = () => {
  const [state, actions] = useTradingBot();
  const { toast } = useToast();

  // Initialize connection on component mount if API keys are available
  useEffect(() => {
    // Check if we have stored bot running state in localStorage
    const storedBotRunning = localStorage.getItem('tradingBotRunning') === 'true';
    
    // If bot should be running but isn't currently running, start it
    if (storedBotRunning && !state.isRunning) {
      setTimeout(() => actions.startBot(), 500); // Slight delay to ensure proper initialization
    }
    
    // Connect to exchange if API keys are available
    if (state.apiKeys.exchangeApiKey && state.apiKeys.exchangeApiSecret && !state.isExchangeConnected) {
      actions.reconnectExchange();
      toast({
        title: "Connecting to Exchange",
        description: `Attempting to connect to Kraken API...`
      });
    }
  }, []);
  
  // Update localStorage when bot running state changes
  useEffect(() => {
    localStorage.setItem('tradingBotRunning', state.isRunning ? 'true' : 'false');
  }, [state.isRunning]);

  const handleReconnect = () => {
    actions.reconnectExchange();
    toast({
      title: "Reconnecting to Exchange",
      description: `Attempting to connect to ${state.exchangeName}...`
    });
  };
  
  const handleDisconnect = () => {
    actions.disconnectExchange();
    toast({
      title: "Exchange Disconnected",
      description: `Connection to ${state.exchangeName} terminated`
    });
  };
  
  const handleTestConnection = () => {
    actions.testExchangeConnection();
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${state.exchangeName}...`
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6 lg:col-span-1">
        <BotControlPanel
          isRunning={state.isRunning}
          tradeMode={state.tradeMode}
          riskLevel={state.riskLevel}
          tradingStrategy={state.tradingStrategy}
          maxTradingAmount={state.maxTradingAmount}
          tradingPair={state.tradingPair}
          cpuUsage={state.cpuUsage}
          memoryUsage={state.memoryUsage}
          executionTime={state.executionTime}
          lastTrade={state.lastTrade}
          tradingPairs={tradingPairs}
          tradingStrategies={tradingStrategies}
          onStartBot={actions.startBot}
          onStopBot={actions.stopBot}
          onClearLogs={actions.clearLogs}
          onToggleTradingMode={actions.toggleTradingMode}
          onTradingPairChange={actions.setTradingPair}
          onTradingStrategyChange={actions.setTradingStrategy}
          onRiskLevelChange={actions.setRiskLevel}
          onMaxTradingAmountChange={actions.setMaxTradingAmount}
          onConfigureApiKeys={actions.configureApiKeys}
          hasApiKeys={!!state.apiKeys.exchangeApiKey && !!state.apiKeys.exchangeApiSecret}
          autoPaperTrade={state.autoPaperTrade}
          onToggleAutoPaperTrade={actions.toggleAutoPaperTrade}
        />
        
        <ConnectionStatusPanel
          isConnected={state.isExchangeConnected}
          exchangeName={state.exchangeName}
          apiEndpoint={state.apiKeys.apiEndpoint}
          lastPing={state.exchangeLatency}
          connectionQuality={state.connectionQuality}
          onReconnect={handleReconnect}
          onDisconnect={handleDisconnect}
          onTest={handleTestConnection}
        />
      </div>
      
      <BotLogPanel
        logs={state.logs}
        isRunning={state.isRunning}
        onRefreshData={actions.refreshData}
        isExchangeConnected={state.isExchangeConnected}
      />

      {state.showApiConfig && (
        <ApiKeyConfig
          apiKeys={state.apiKeys}
          onSave={actions.handleSaveApiKeys}
          onCancel={() => actions.setShowApiConfig(false)}
        />
      )}
    </div>
  );
};
