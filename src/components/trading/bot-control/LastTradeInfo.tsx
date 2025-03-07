
import React from 'react';
import { Clock } from 'lucide-react';

interface LastTradeInfoProps {
  lastTrade: {
    type: 'buy' | 'sell';
    price: string;
    amount: string;
    timestamp: string;
  };
}

export const LastTradeInfo: React.FC<LastTradeInfoProps> = ({ lastTrade }) => {
  return (
    <div className="rounded-md border p-4">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Last Trade
      </h3>
      <div className="grid grid-cols-2 gap-y-2">
        <div className="text-sm text-muted-foreground">Type:</div>
        <div className={`text-sm font-medium ${lastTrade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
          {lastTrade.type.toUpperCase()}
        </div>
        
        <div className="text-sm text-muted-foreground">Amount:</div>
        <div className="text-sm font-medium">{lastTrade.amount} BTC</div>
        
        <div className="text-sm text-muted-foreground">Price:</div>
        <div className="text-sm font-medium">${lastTrade.price}</div>
        
        <div className="text-sm text-muted-foreground">Time:</div>
        <div className="text-sm font-medium">
          {new Date(lastTrade.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
