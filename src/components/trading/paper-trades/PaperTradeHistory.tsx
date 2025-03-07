
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { ClosedTrade } from './PaperTradesPanel';

interface PaperTradeHistoryProps {
  closedTrades: ClosedTrade[];
}

export const PaperTradeHistory: React.FC<PaperTradeHistoryProps> = ({ closedTrades }) => {
  // Calculate overall stats
  const totalProfit = closedTrades.reduce((sum, trade) => sum + trade.finalProfit, 0);
  const profitableTrades = closedTrades.filter(trade => trade.finalProfit > 0).length;
  const winRate = closedTrades.length > 0 ? (profitableTrades / closedTrades.length) * 100 : 0;
  
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div className="space-y-4">
      {closedTrades.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Total Closed Trades</p>
              <p className="text-2xl font-bold">{closedTrades.length}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
              </p>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {closedTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    <div className="text-xs">
                      <div>Open: {formatDate(trade.timestamp)}</div>
                      <div>Closed: {formatDate(trade.closedAt)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{trade.symbol.split('-')[0]}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={trade.type === 'buy' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }
                    >
                      {trade.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>${trade.price.toFixed(2)}</TableCell>
                  <TableCell>${trade.closedPrice.toFixed(2)}</TableCell>
                  <TableCell>{trade.amount.toFixed(4)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {trade.finalProfit >= 0 ? (
                        <>
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span className="text-green-500">
                            +${trade.finalProfit.toFixed(2)} ({trade.finalProfitPercentage.toFixed(2)}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                          <span className="text-red-500">
                            -${Math.abs(trade.finalProfit).toFixed(2)} ({Math.abs(trade.finalProfitPercentage).toFixed(2)}%)
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md border-dashed text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No closed trades yet. Close a position to see your trading history.</p>
        </div>
      )}
    </div>
  );
};
