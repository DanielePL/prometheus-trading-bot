
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TradingPair {
  id: string;
  name: string;
  price: string;
  change24h: number;
  volume: string;
  status: 'active' | 'inactive' | 'pending';
  strategy: string;
}

interface TradingPairsProps {
  onSelectSymbol?: (symbol: string) => void;
}

const tradingPairs: TradingPair[] = [
  {
    id: '1',
    name: 'BTC/USDT',
    price: '$45,230.50',
    change24h: 2.34,
    volume: '$1.2M',
    status: 'active',
    strategy: 'MACD Crossover',
  },
  {
    id: '2',
    name: 'ETH/USDT',
    price: '$2,456.75',
    change24h: -1.21,
    volume: '$890K',
    status: 'active',
    strategy: 'RSI Oversold',
  },
  {
    id: '3',
    name: 'SOL/USDT',
    price: '$123.45',
    change24h: 5.67,
    volume: '$345K',
    status: 'active',
    strategy: 'EMA Crossover',
  },
  {
    id: '4',
    name: 'ADA/USDT',
    price: '$0.52',
    change24h: 0.0,
    volume: '$122K',
    status: 'pending',
    strategy: 'Bollinger Bands',
  },
  {
    id: '5',
    name: 'XRP/USDT',
    price: '$0.56',
    change24h: -0.87,
    volume: '$78K',
    status: 'inactive',
    strategy: 'Support/Resistance',
  },
];

export const TradingPairs: React.FC<TradingPairsProps> = ({ onSelectSymbol }) => {
  const handleRowClick = (pair: TradingPair) => {
    // Extract the symbol from the pair name (e.g., "BTC/USDT" -> "BTC-USD")
    const symbol = pair.name.replace('/', '-').replace('USDT', 'USD');
    if (onSelectSymbol) {
      onSelectSymbol(symbol);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Trading Pairs</CardTitle>
        <CardDescription>Active trading pairs monitored by your bot</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead className="hidden md:table-cell">Volume</TableHead>
              <TableHead className="hidden md:table-cell">Strategy</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradingPairs.map((pair) => (
              <TableRow 
                key={pair.id} 
                className="hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(pair)}
              >
                <TableCell className="font-medium">{pair.name}</TableCell>
                <TableCell>{pair.price}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {pair.change24h > 0 ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-trade-up" />
                    ) : pair.change24h < 0 ? (
                      <TrendingDown className="mr-1 h-4 w-4 text-trade-down" />
                    ) : (
                      <Minus className="mr-1 h-4 w-4 text-trade-neutral" />
                    )}
                    <span
                      className={
                        pair.change24h > 0
                          ? 'text-trade-up'
                          : pair.change24h < 0
                          ? 'text-trade-down'
                          : 'text-trade-neutral'
                      }
                    >
                      {pair.change24h > 0 ? '+' : ''}
                      {pair.change24h}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{pair.volume}</TableCell>
                <TableCell className="hidden md:table-cell">{pair.strategy}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${pair.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${pair.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${pair.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    `}
                  >
                    {pair.status.charAt(0).toUpperCase() + pair.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
