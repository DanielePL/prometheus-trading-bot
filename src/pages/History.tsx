
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, History as HistoryIcon, Search } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'trade' | 'deposit' | 'withdrawal' | 'system';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  details: string;
}

const historyData: HistoryItem[] = [
  {
    id: '1',
    type: 'trade',
    description: 'BTC/USDT trade closed with profit',
    date: '2023-10-15 14:23',
    status: 'completed',
    details: 'Profit: +3.2% (MACD Crossover strategy)'
  },
  {
    id: '2',
    type: 'deposit',
    description: 'USDT deposit from external wallet',
    date: '2023-10-14 09:15',
    status: 'completed',
    details: 'Amount: 1,000 USDT'
  },
  {
    id: '3',
    type: 'trade',
    description: 'ETH/USDT trade closed with loss',
    date: '2023-10-13 16:45',
    status: 'completed',
    details: 'Loss: -1.9% (RSI Divergence strategy)'
  },
  {
    id: '4',
    type: 'system',
    description: 'Bot restarted due to system maintenance',
    date: '2023-10-12 02:30',
    status: 'completed',
    details: 'Downtime: 5 minutes'
  },
  {
    id: '5',
    type: 'withdrawal',
    description: 'BTC withdrawal to external wallet',
    date: '2023-10-10 11:05',
    status: 'completed',
    details: 'Amount: 0.05 BTC'
  },
  {
    id: '6',
    type: 'trade',
    description: 'SOL/USDT trade opened',
    date: '2023-10-08 15:22',
    status: 'completed',
    details: 'Entry: $123.45 (Bull Flag Pattern strategy)'
  },
  {
    id: '7',
    type: 'system',
    description: 'Strategy parameter updated',
    date: '2023-10-07 10:15',
    status: 'completed',
    details: 'MACD Crossover: adjusted signal threshold'
  },
  {
    id: '8',
    type: 'deposit',
    description: 'ETH deposit from external wallet',
    date: '2023-10-05 09:30',
    status: 'pending',
    details: 'Amount: 2.5 ETH (waiting for confirmation)'
  }
];

const History = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground mt-1">
            View your complete trading and system activity history
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search history..." className="pl-8" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${item.type === 'trade' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${item.type === 'deposit' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${item.type === 'withdrawal' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                          ${item.type === 'system' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                        `}
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${item.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>8</strong> of <strong>24</strong> entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
