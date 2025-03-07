
import React from 'react';
import { BotControlPanel } from './BotControlPanel';
import { BotLogPanel } from './BotLogPanel';
import { ApiKeyConfig } from './ApiKeyConfig';
import { useTradingBot, tradingPairs, tradingStrategies } from '@/hooks/useTradingBot';

export const TradingBot = () => {
  const [state, actions] = useTradingBot();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
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
      />
      
      <BotLogPanel
        logs={state.logs}
        isRunning={state.isRunning}
        onRefreshData={actions.refreshData}
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
