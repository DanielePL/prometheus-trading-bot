
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, LineChart, Code, Server, Layers, Shield, GitBranch, Bell } from 'lucide-react';

export const SupabaseIntegrationGuide = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <span>Prometheus Supabase Integration Guide</span>
        </CardTitle>
        <CardDescription>
          Blueprint for integrating your trading system with Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="data-model" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="data-model" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Database className="h-4 w-4 mr-2" />
              Data Model
            </TabsTrigger>
            <TabsTrigger 
              value="setup" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Server className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger 
              value="implementation" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Code className="h-4 w-4 mr-2" />
              Implementation
            </TabsTrigger>
            <TabsTrigger 
              value="frontend" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Frontend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-model" className="px-4 py-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Trades Table</h3>
              <p className="text-sm text-muted-foreground mb-2">Track all executed trades from your system</p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  trade_id, timestamp, trade_type (BUY/SELL), pair, price, quantity, fees, profit/loss, order_status
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Positions Table</h3>
              <p className="text-sm text-muted-foreground mb-2">Track open and closed positions</p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  position_id, open_time, close_time, entry_price, exit_price, quantity, stop_loss, take_profit, current_value, status
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Performance Metrics Table</h3>
              <p className="text-sm text-muted-foreground mb-2">Track trading performance over time</p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  date, total_trades, win_count, loss_count, profit, drawdown, roi_percentage, sharpe_ratio
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Signals Table</h3>
              <p className="text-sm text-muted-foreground mb-2">Store historical trading signals</p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  signal_id, timestamp, pair, signal_type, confidence_score, technical_score, sentiment_score, action, executed
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Server className="h-4 w-4 mr-2" />
                Create Supabase Project
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Sign up for Supabase and create a new project named "Prometheus"</li>
                <li>Copy your API keys for integration with your trading system</li>
                <li>Set up database tables using the SQL editor or UI</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Configure Row Level Security
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Set up RLS policies to secure your trading data</li>
                <li>Create specific roles for your trading system and dashboard</li>
                <li>Implement proper authentication for secure access</li>
              </ul>
              <div className="bg-muted p-3 rounded-md text-sm mt-2">
                <code>
                  CREATE POLICY "Enable read for authenticated users" <br />
                  ON public.trades <br />
                  FOR SELECT <br />
                  TO authenticated <br />
                  USING (auth.uid() = user_id);
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Set Up Authentication
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Configure authentication providers (email, OAuth, etc.)</li>
                <li>Create service roles for your trading system's server access</li>
                <li>Set up API keys with appropriate permissions</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Trading Engine Integration
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Install Supabase client in your Python trading system</li>
                <li>Use Supabase client to record trades, positions, and signals</li>
                <li>Implement real-time updates for critical data</li>
              </ul>
              <div className="bg-muted p-3 rounded-md text-sm mt-2">
                <code>
                  # Python code for Supabase integration <br />
                  from supabase import create_client <br /><br />
                  
                  supabase = create_client(SUPABASE_URL, SUPABASE_KEY) <br /><br />
                  
                  # Record a new trade <br />
                  def record_trade(trade_data): <br />
                  &nbsp;&nbsp;return supabase.table('trades').insert(trade_data).execute()
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                Edge Functions (Optional)
              </h3>
              <p className="text-sm text-muted-foreground">For event-driven tasks and scheduled operations</p>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Implement daily summary calculation functions</li>
                <li>Create webhooks for trading events and alerts</li>
                <li>Set up scheduled jobs for data maintenance</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                External Data Sources
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Connect to Kraken API for market data</li>
                <li>Integrate news APIs for sentiment analysis</li>
                <li>Store processed data in Supabase for analysis</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="frontend" className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Dashboard Integration
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Install Supabase client in your React frontend</li>
                <li>Set up authentication in your dashboard</li>
                <li>Create components for displaying trading data</li>
              </ul>
              <div className="bg-muted p-3 rounded-md text-sm mt-2">
                <code>
                  // React code for Supabase integration <br />
                  import {'{ createClient }'} from '@supabase/supabase-js' <br /><br />
                  
                  const supabase = createClient( <br />
                  &nbsp;&nbsp;import.meta.env.VITE_SUPABASE_URL, <br />
                  &nbsp;&nbsp;import.meta.env.VITE_SUPABASE_ANON_KEY <br />
                  ); <br /><br />
                  
                  // Fetch trades <br />
                  const fetchTrades = async () => {'{'} <br />
                  &nbsp;&nbsp;const {'{ data, error }'} = await supabase <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.from('trades') <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.select('*') <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.order('timestamp', {'{ ascending: false }'}); <br />
                  {'}'}
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Real-time Updates
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Implement real-time subscriptions for trades and signals</li>
                <li>Create toast notifications for important events</li>
                <li>Update charts and tables dynamically</li>
              </ul>
              <div className="bg-muted p-3 rounded-md text-sm mt-2">
                <code>
                  // Subscribe to real-time updates <br />
                  const tradesSubscription = supabase <br />
                  &nbsp;&nbsp;.channel('table-db-changes') <br />
                  &nbsp;&nbsp;.on('postgres_changes', <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{'{ event: "INSERT", schema: "public", table: "trades" }'}, <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;(payload) => handleNewTrade(payload.new) <br />
                  &nbsp;&nbsp;) <br />
                  &nbsp;&nbsp;.subscribe();
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Testing & Deployment
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                <li>Run backtests with historical data from Supabase</li>
                <li>Implement paper trading mode for live testing</li>
                <li>Deploy your trading engine on a cloud platform</li>
                <li>Deploy your dashboard to a hosting service</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
