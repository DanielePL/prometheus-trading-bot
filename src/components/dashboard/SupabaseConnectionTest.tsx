
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testSupabaseConnection, getConnectionTests } from '@/integrations/supabase/testConnection';
import { useToast } from '@/hooks/use-toast';
import { Database, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  timestamp: string;
  data?: any;
}

export const SupabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [previousTests, setPreviousTests] = useState<any[]>([]);
  const [showPreviousTests, setShowPreviousTests] = useState(false);
  const { toast } = useToast();

  const runConnectionTest = async () => {
    setIsLoading(true);
    
    try {
      const result = await testSupabaseConnection();
      
      const testResult: TestResult = {
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString(),
        data: result.data
      };
      
      setResults(prev => [testResult, ...prev].slice(0, 5));
      
      toast({
        title: result.success ? 'Connection Successful' : 'Connection Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      
    } catch (error) {
      console.error('Error running connection test:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setResults(prev => [{
        success: false,
        message: `Error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 5));
      
      toast({
        title: 'Test Error',
        description: `An error occurred: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreviousTests = async () => {
    setShowPreviousTests(true);
    
    try {
      const result = await getConnectionTests();
      
      if (result.success && result.data) {
        setPreviousTests(result.data);
      } else {
        toast({
          title: 'Error Loading Tests',
          description: 'Could not retrieve previous connection tests',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading previous tests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load previous connection tests',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button 
            onClick={runConnectionTest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Test Supabase Connection
              </>
            )}
          </Button>
          
          {results.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-medium">Recent Test Results</h3>
              {results.map((result, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-md border ${
                    result.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.success 
                      ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> 
                      : <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    }
                    <div>
                      <p className="font-medium">{result.success ? 'Success' : 'Failed'}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!showPreviousTests && (
            <Button variant="outline" onClick={loadPreviousTests} className="mt-2">
              Load Previous Tests from Database
            </Button>
          )}
          
          {showPreviousTests && previousTests.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-medium">Tests from Database</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Test Name</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousTests.map((test) => (
                      <tr key={test.id} className="border-b">
                        <td className="py-2 px-2">{test.test_name}</td>
                        <td className="py-2 px-2">{test.status}</td>
                        <td className="py-2 px-2">
                          {new Date(test.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground border-t">
        <p>
          Tests write to and read from the 'connection_tests' table in your Supabase database.
          Successful tests indicate your app is correctly configured.
        </p>
      </CardFooter>
    </Card>
  );
};
