
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowUpRight, ArrowDownRight, Copy, AlertCircle, 
  CheckCircle, Clock, Download, QrCode, ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  asset: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txid: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    asset: 'BTC',
    amount: '0.05 BTC',
    status: 'completed',
    date: '2023-10-15 14:23',
    txid: '3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u'
  },
  {
    id: '2',
    type: 'withdrawal',
    asset: 'ETH',
    amount: '1.2 ETH',
    status: 'completed',
    date: '2023-10-14 09:15',
    txid: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t'
  },
  {
    id: '3',
    type: 'deposit',
    asset: 'USDT',
    amount: '1,000 USDT',
    status: 'completed',
    date: '2023-10-13 16:45',
    txid: '2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s'
  },
  {
    id: '4',
    type: 'withdrawal',
    asset: 'SOL',
    amount: '10 SOL',
    status: 'pending',
    date: '2023-10-12 11:30',
    txid: '4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q'
  },
  {
    id: '5',
    type: 'deposit',
    asset: 'ETH',
    amount: '0.5 ETH',
    status: 'pending',
    date: '2023-10-12 10:05',
    txid: '5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p'
  }
];

const Deposits = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deposits & Withdrawals</h1>
          <p className="text-muted-foreground mt-1">
            Manage your crypto deposits and withdrawals
          </p>
        </div>
        
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="deposit">
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Crypto</CardTitle>
                  <CardDescription>
                    Send crypto to your Prometheus wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Asset</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="USDT">Tether (USDT)</option>
                      <option value="ADA">Cardano (ADA)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="BTC">Bitcoin</option>
                      <option value="ETH">Ethereum (ERC-20)</option>
                      <option value="BSC">Binance Smart Chain (BEP-20)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Your BTC Deposit Address</label>
                        <Button variant="ghost" size="sm" className="h-5 px-1">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Input 
                        value="3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" 
                        readOnly 
                        className="font-mono text-sm bg-muted"
                      />
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="h-32 w-32 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Scan to copy address
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex justify-between py-4">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Only send BTC to this address. Sending any other asset may result in permanent loss.</p>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                  <CardDescription>
                    Read before making a deposit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Processing Time</h3>
                    <div className="flex space-x-4 text-sm">
                      <div className="flex-1 p-3 bg-muted/40 rounded-lg text-center">
                        <div className="font-medium">3</div>
                        <div className="text-xs text-muted-foreground">Network Confirmations</div>
                      </div>
                      <div className="flex-1 p-3 bg-muted/40 rounded-lg text-center">
                        <div className="font-medium">10-30</div>
                        <div className="text-xs text-muted-foreground">Minutes Average</div>
                      </div>
                      <div className="flex-1 p-3 bg-muted/40 rounded-lg text-center">
                        <div className="font-medium">24/7</div>
                        <div className="text-xs text-muted-foreground">Processing</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Minimum Deposit</h3>
                    <div className="flex items-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium">0.0001 BTC</span>
                        <div className="text-xs text-muted-foreground">Deposits below this amount will not be processed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Tips</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Double-check the deposit address before sending</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Verify the network you're using for the transfer</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Larger deposits require more confirmations</span>
                      </li>
                      <li className="flex">
                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                        <span>Funds will be available for trading after confirmation</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Crypto</CardTitle>
                <CardDescription>
                  Send crypto from your Prometheus wallet to an external address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Asset</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="USDT">Tether (USDT)</option>
                      <option value="ADA">Cardano (ADA)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="BTC">Bitcoin</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Address</label>
                  <Input placeholder="Enter BTC address" />
                  <p className="text-xs text-muted-foreground">Double check this address. Transfers cannot be reversed.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input placeholder="0.00" type="number" step="0.0001" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Available Balance</label>
                      <span className="text-sm">0.45 BTC</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs flex-1">25%</Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1">50%</Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1">75%</Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1">Max</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network Fee</span>
                      <span>0.0004 BTC</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>You will receive</span>
                      <span>0.0496 BTC</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Withdraw Bitcoin</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Recent deposits and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {tx.type === 'deposit' ? 
                          <ArrowDownRight className="mr-2 h-4 w-4 text-green-500" /> : 
                          <ArrowUpRight className="mr-2 h-4 w-4 text-blue-500" />
                        }
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tx.asset}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${tx.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${tx.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}
                      >
                        {tx.status === 'completed' && 
                          <CheckCircle className="mr-1 h-3 w-3" />
                        }
                        {tx.status === 'pending' && 
                          <Clock className="mr-1 h-3 w-3" />
                        }
                        {tx.status === 'failed' && 
                          <AlertCircle className="mr-1 h-3 w-3" />
                        }
                        <span className="capitalize">{tx.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs truncate max-w-[80px]">{tx.txid}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
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

export default Deposits;
