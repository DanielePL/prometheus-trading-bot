
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketData } from '@/types/market';

interface MarketTableProps {
  data: MarketData[];
  handleTrackToggle: (id: string) => void;
}

export const MarketTable = ({ data, handleTrackToggle }: MarketTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Asset</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
          <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((market) => (
            <TableRow key={market.id} className="hover:bg-secondary/50 transition-colors">
              <TableCell className="font-medium">{market.symbol}</TableCell>
              <TableCell>{market.name}</TableCell>
              <TableCell>{market.price}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {market.change24h > 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : market.change24h < 0 ? (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="mr-1 h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={
                      market.change24h > 0
                        ? 'text-green-500'
                        : market.change24h < 0
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }
                  >
                    {market.change24h > 0 ? '+' : ''}
                    {market.change24h}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{market.volume}</TableCell>
              <TableCell className="hidden lg:table-cell">{market.marketCap}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant={market.tracked ? "default" : "outline"} 
                  size="sm"
                  className={market.tracked ? "bg-primary" : ""}
                  onClick={() => handleTrackToggle(market.id)}
                >
                  {market.tracked ? "Tracked" : "Track"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
