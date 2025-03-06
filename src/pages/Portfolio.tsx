
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, PieChart, TrendingUp, TrendingDown, 
  RefreshCcw, Wallet, BarChart, Download, ArrowUpRight 
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  value: string;
  allocation: number;
  change24h: number;
  color: string;
}

const assets: Asset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.45 BTC',
    value: '$20,353.73',
    allocation: 42.5,
    change24h: 2.34,
    color: '#F7931A'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: '5.2 ETH',
    value: '$12,772.30',
    allocation: 26.7,
    change24h: -1.21,
    color: '#627EEA'
  },
  {
    id: '3',
    name: 'Solana',
    symbol: 'SOL',
    amount: '45.8 SOL',
    value: '$5,653.34',
    allocation: 11.8,
    change24h: 5.67,
    color: '#00FFA3'
  },
  {
    id: '4',
    name: 'USD Tether',
    symbol: 'USDT',
    amount: '8,500 USDT',
    value: '$8,500.00',
    allocation: 17.8,
    change24h: 0.02,
    color: '#26A17B'
  },
  {
    id: '5',
    name: 'Cardano',
    symbol: 'ADA',
    amount: '1,250 ADA',
    value: '$550.00',
    allocation: 1.2,
    change24h: -2.35,
    color: '#0033AD'
  }
];

const Portfolio = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your cryptocurrency holdings
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$47,829.37</div>
              <div className="flex items-center mt-1 text-sm text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                3.2% (24h)
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bitcoin Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.5%</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Of total portfolio
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cash Equivalent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,500.00</div>
              <div className="mt-1 text-sm text-muted-foreground">
                USDT, USDC, DAI
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Different cryptocurrencies
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>
                Breakdown of your portfolio by cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                <PieChart className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Asset allocation chart will be implemented here</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                Historical portfolio value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                <BarChart className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Portfolio performance chart will be implemented here</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>
              Your current cryptocurrency assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Holdings</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2" 
                          style={{ backgroundColor: asset.color }}
                        ></div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{asset.amount}</TableCell>
                    <TableCell>{asset.value}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 h-2 rounded-full bg-secondary mr-2">
                          <div 
                            className="h-full rounded-full bg-primary" 
                            style={{ width: `${asset.allocation}%` }}
                          ></div>
                        </div>
                        <span>{asset.allocation}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {asset.change24h > 0 ? (
                          <>
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{asset.change24h}%</span>
                          </>
                        ) : asset.change24h < 0 ? (
                          <>
                            <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-red-500">{asset.change24h}%</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">{asset.change24h}%</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Trade</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Portfolio;
