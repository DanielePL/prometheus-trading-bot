
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Code2, Play, Save, Upload, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const PythonCodeEditor = () => {
  const [code, setCode] = useState<string>(
`# Prometheus Trading Strategy
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def analyze_market(data):
    # Calculate technical indicators
    data['SMA_20'] = data['close'].rolling(window=20).mean()
    data['SMA_50'] = data['close'].rolling(window=50).mean()
    
    # Generate signals
    data['signal'] = 0
    data.loc[data['SMA_20'] > data['SMA_50'], 'signal'] = 1
    data.loc[data['SMA_20'] < data['SMA_50'], 'signal'] = -1
    
    return data

def execute_trades(signals, balance=10000):
    position = 0
    portfolio_value = []
    
    for i in range(len(signals)):
        if signals['signal'][i] == 1 and position == 0:
            # Buy signal
            position = 1
        elif signals['signal'][i] == -1 and position == 1:
            # Sell signal
            position = 0
            
        # Calculate portfolio value
        portfolio_value.append(balance * (1 + position * signals['returns'][i]))
        
    return pd.Series(portfolio_value)

# Main function called by Prometheus
def run_strategy(market_data):
    signals = analyze_market(market_data)
    performance = execute_trades(signals)
    return {
        'signals': signals,
        'performance': performance,
        'sharpe_ratio': calculate_sharpe(performance)
    }`
  );
  
  const [executing, setExecuting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string>('');
  const { toast } = useToast();

  const validatePythonCode = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('python-integration', {
        body: { action: 'validate', code },
      });

      if (error) throw error;

      if (data.valid) {
        toast({
          title: "Code Validation Successful",
          description: "Your Python code syntax is valid.",
        });
        return true;
      } else {
        toast({
          title: "Code Validation Failed",
          description: data.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast({
        title: "Validation Error",
        description: "Could not validate your Python code.",
        variant: "destructive",
      });
      return false;
    }
  };

  const executePythonCode = async () => {
    setExecuting(true);
    setExecutionResult(null);
    setExecutionError('');

    try {
      // First validate
      const isValid = await validatePythonCode();
      if (!isValid) {
        setExecuting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('python-integration', {
        body: { action: 'execute', code },
      });

      if (error) throw error;
      
      setExecutionResult(data.result);
      
      toast({
        title: "Code Executed Successfully",
        description: "Your Python strategy has been executed.",
      });
    } catch (error) {
      console.error("Error executing code:", error);
      setExecutionError("Failed to execute Python code. Please check your code and try again.");
      
      toast({
        title: "Execution Error",
        description: "Could not execute your Python code.",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const savePythonCode = async () => {
    setSaving(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('python-integration', {
        body: { action: 'store', code },
      });

      if (error) throw error;
      
      toast({
        title: "Strategy Saved",
        description: `Your Python strategy has been saved (ID: ${data.fileId}).`,
      });
    } catch (error) {
      console.error("Error saving code:", error);
      
      toast({
        title: "Save Error",
        description: "Could not save your Python code.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setCode(content);
        toast({
          title: "File Uploaded",
          description: `Loaded ${file.name}`,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <span>Python Strategy Editor</span>
        </CardTitle>
        <CardDescription>
          Write, test and deploy Python trading strategies for Prometheus
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="editor" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Code2 className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger 
              value="result" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Play className="h-4 w-4 mr-2" />
              Execution Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="px-4 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Python 3.10
                </Badge>
                <Badge variant="outline">Strategy</Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".py"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm h-[400px] resize-none"
              placeholder="# Write your Python trading strategy here"
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={validatePythonCode}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  onClick={executePythonCode} 
                  disabled={executing}
                >
                  {executing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Strategy
                    </>
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={savePythonCode}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Strategy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="px-4 py-4">
            {executionError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Execution Error</AlertTitle>
                <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
                  {executionError}
                </AlertDescription>
              </Alert>
            ) : executionResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={executionResult.status === 'completed' 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  }>
                    {executionResult.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge variant="outline">Time: {executionResult.metrics?.executionTime || 'N/A'}</Badge>
                    <Badge variant="outline">Memory: {executionResult.metrics?.memoryUsage || 'N/A'}</Badge>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Output:</h3>
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {executionResult.output}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Run your strategy to see results here
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Python code executes in an isolated environment. API access is limited to approved endpoints.</p>
      </CardFooter>
    </Card>
  );
};
