
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, Plus, RefreshCw, 
  Search, SlidersHorizontal, ExternalLink, Copy
} from 'lucide-react';

interface AssetItem {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  valueUsd: string;
  address: string;
  network: string;
  status: 'active' | 'inactive';
}

const assets: AssetItem[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '0.45 BTC',
    valueUsd: '$20,353.73',
    address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    network: 'Bitcoin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '5.2 ETH',
    valueUsd: '$12,772.30',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    network: 'Ethereum',
    status: 'active'
  },
  {
    id: '3',
    name: 'Solana',
    symbol: 'SOL',
    balance: '45.8 SOL',
    valueUsd: '$5,653.34',
    address: '8xk7nMLRLJmTgM4NW7xPnEvqeQ4nBQXyKW1hLKS4qNqR',
    network: 'Solana',
    status: 'active'
  },
  {
    id: '4',
    name: 'USD Tether',
    symbol: 'USDT',
    balance: '8,500 USDT',
    valueUsd: '$8,500.00',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    network: 'Ethereum (ERC-20)',
    status: 'active'
  },
  {
    id: '5',
    name: 'Cardano',
    symbol: 'ADA',
    balance: '1,250 ADA',
    valueUsd: '$550.00',
    address: 'addr1qxy3s8v6m55zvxurfdzqz4e9ge5nzl2snfuqj4j...',
    network: 'Cardano',
    status: 'inactive'
  }
];

const Assets = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground mt-1">
              Manage your crypto assets and wallets
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button className="gap-2">
              <Plus size={16} />
              Add Asset
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
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
              <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Across 4 networks
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trading Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$39,329.37</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Available for bot trading
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,500.00</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Locked in pending trades
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="assets" className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search assets..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                        </TableCell>
                        <TableCell>{asset.balance}</TableCell>
                        <TableCell>{asset.valueUsd}</TableCell>
                        <TableCell>{asset.network}</TableCell>
                        <TableCell>
                          <Badge
                            variant={asset.status === 'active' ? 'default' : 'outline'}
                            className={asset.status === 'inactive' ? 'text-muted-foreground' : ''}
                          >
                            {asset.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                            <Button variant="outline" size="sm">
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              Receive
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Network</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Assets</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(new Set(assets.map(a => a.network))).map((network) => {
                      const networkAssets = assets.filter(a => a.network === network);
                      const address = networkAssets[0].address;
                      const totalValue = networkAssets.reduce((sum, asset) => 
                        sum + parseFloat(asset.valueUsd.replace('$', '').replace(',', '')), 0);
                      
                      return (
                        <TableRow key={network}>
                          <TableCell className="font-medium">{network}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm truncate max-w-[180px]">{address}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{networkAssets.length}</TableCell>
                          <TableCell>${totalValue.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Explorer
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent asset transfers and trades
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-60">
                <div className="text-center space-y-2">
                  <Wallet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">Transaction history will appear here</h3>
                  <p className="text-sm text-muted-foreground">
                    Send or receive assets to see your transaction history
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Assets;
