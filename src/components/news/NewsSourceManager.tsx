
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Settings, RefreshCw, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNewsSources, addNewsSource, updateNewsSource, deleteNewsSource, saveApiKeys, NewsSource } from '@/services/newsCrawlerService';

export const NewsSourceManager = () => {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);
  const [apiKeysDialogOpen, setApiKeysDialogOpen] = useState(false);
  
  // Initialize with default API keys
  const [apiKeys, setApiKeys] = useState({
    redditClientId: localStorage.getItem('redditClientId') || '',
    redditApiKey: localStorage.getItem('redditApiKey') || '',
    newsIoApiKey: localStorage.getItem('newsIoApiKey') || '',
    alphaVantageApiKey: localStorage.getItem('alphaVantageApiKey') || '',
    etherscanApiKey: localStorage.getItem('etherscanApiKey') || '',
  });
  
  // New state for custom API keys
  const [customApiKeys, setCustomApiKeys] = useState<{name: string, value: string}[]>([]);
  const [newApiKey, setNewApiKey] = useState({name: '', value: ''});
  
  const [newSource, setNewSource] = useState<Omit<NewsSource, 'id'>>({
    name: '',
    type: 'custom',
    url: '',
    enabled: true,
    parameters: {}
  });

  useEffect(() => {
    setSources(getNewsSources());
    
    // Load custom API keys from localStorage
    const customKeysStr = localStorage.getItem('customApiKeys');
    if (customKeysStr) {
      try {
        setCustomApiKeys(JSON.parse(customKeysStr));
      } catch (e) {
        console.error("Failed to parse custom API keys:", e);
      }
    }
  }, []);

  const handleToggleSource = (id: string, enabled: boolean) => {
    const updatedSources = sources.map(source => 
      source.id === id ? { ...source, enabled } : source
    );
    setSources(updatedSources);
    
    const source = updatedSources.find(s => s.id === id);
    if (source) {
      updateNewsSource(source);
    }
  };

  const handleDeleteSource = (id: string) => {
    deleteNewsSource(id);
    setSources(sources.filter(s => s.id !== id));
  };

  const handleAddSource = () => {
    if (!newSource.name) return;
    
    const added = addNewsSource(newSource);
    setSources([...sources, added]);
    setNewSource({
      name: '',
      type: 'custom',
      url: '',
      enabled: true,
      parameters: {}
    });
    setNewSourceDialogOpen(false);
  };

  const handleSaveApiKeys = () => {
    saveApiKeys(apiKeys);
    
    // Save custom API keys
    const customKeysObj: Record<string, string> = {};
    customApiKeys.forEach(key => {
      customKeysObj[key.name] = key.value;
      localStorage.setItem(key.name, key.value);
    });
    
    localStorage.setItem('customApiKeys', JSON.stringify(customApiKeys));
    
    setApiKeysDialogOpen(false);
  };
  
  const handleAddCustomApiKey = () => {
    if (!newApiKey.name.trim()) return;
    
    setCustomApiKeys([...customApiKeys, { ...newApiKey }]);
    setNewApiKey({ name: '', value: '' });
  };
  
  const handleRemoveCustomApiKey = (index: number) => {
    const keyToRemove = customApiKeys[index];
    localStorage.removeItem(keyToRemove.name);
    
    const updatedKeys = [...customApiKeys];
    updatedKeys.splice(index, 1);
    setCustomApiKeys(updatedKeys);
  };

  const renderSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'reddit':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">Reddit</Badge>;
      case 'news':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">News</Badge>;
      case 'finance':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Finance</Badge>;
      case 'crypto':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Crypto</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">Custom</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>News Sources</CardTitle>
            <CardDescription>Manage data sources for market intelligence</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setApiKeysDialogOpen(true)}>
              <Key className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setNewSourceDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          {sources.map((source) => (
            <AccordionItem key={source.id} value={source.id}>
              <div className="flex items-center justify-between">
                <AccordionTrigger className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {renderSourceTypeIcon(source.type)}
                    <span className="truncate">{source.name}</span>
                  </div>
                </AccordionTrigger>
                <Switch 
                  checked={source.enabled}
                  onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                  className="mr-4"
                />
              </div>
              <AccordionContent>
                <div className="space-y-2">
                  {source.url && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">URL:</span> {source.url}
                    </div>
                  )}
                  {source.parameters && Object.keys(source.parameters).length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">Parameters:</span>
                      <div className="mt-1 grid grid-cols-1 gap-1">
                        {Object.entries(source.parameters).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <span className="text-xs bg-muted rounded px-1.5 py-0.5">{key}</span>
                            <span className="text-xs mx-1">:</span>
                            <span className="text-xs truncate">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {sources.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <div className="mb-2">No sources added yet</div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNewSourceDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>
        )}
      </CardContent>
      
      <Dialog open={newSourceDialogOpen} onOpenChange={setNewSourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add News Source</DialogTitle>
            <DialogDescription>
              Add a new source to scan for market intelligence
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input 
                id="sourceName" 
                value={newSource.name}
                onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                placeholder="Federal Reserve News"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select 
                onValueChange={(value) => setNewSource({
                  ...newSource, 
                  type: value as NewsSource['type'],
                  parameters: {}
                })}
                defaultValue={newSource.type}
              >
                <SelectTrigger id="sourceType">
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="news">News API</SelectItem>
                  <SelectItem value="finance">Financial Data</SelectItem>
                  <SelectItem value="crypto">Crypto Service</SelectItem>
                  <SelectItem value="custom">Custom Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newSource.type === 'custom' && (
              <div className="grid gap-2">
                <Label htmlFor="sourceUrl">Website URL</Label>
                <Input 
                  id="sourceUrl" 
                  value={newSource.url || ''}
                  onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                  placeholder="https://example.com/news"
                />
              </div>
            )}
            
            {(newSource.type === 'reddit') && (
              <div className="grid gap-2">
                <Label htmlFor="subreddits">Subreddits (comma separated)</Label>
                <Input 
                  id="subreddits" 
                  value={newSource.parameters?.subreddits || ''}
                  onChange={(e) => setNewSource({
                    ...newSource, 
                    parameters: {
                      ...newSource.parameters,
                      subreddits: e.target.value
                    }
                  })}
                  placeholder="cryptocurrency,bitcoin,ethereum"
                />
              </div>
            )}
            
            {(newSource.type === 'news') && (
              <div className="grid gap-2">
                <Label htmlFor="query">Search Query</Label>
                <Input 
                  id="query" 
                  value={newSource.parameters?.q || ''}
                  onChange={(e) => setNewSource({
                    ...newSource, 
                    parameters: {
                      ...newSource.parameters,
                      q: e.target.value
                    }
                  })}
                  placeholder="cryptocurrency OR bitcoin"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSourceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSource}>Add Source</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={apiKeysDialogOpen} onOpenChange={setApiKeysDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure API Keys</DialogTitle>
            <DialogDescription>
              Enter your API keys for the news and data services
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm font-medium">Reddit API</h3>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="redditClientId">Reddit Client ID</Label>
                <Input 
                  id="redditClientId" 
                  value={apiKeys.redditClientId}
                  onChange={(e) => setApiKeys({...apiKeys, redditClientId: e.target.value})}
                  placeholder="Enter Reddit Client ID"
                  type="password"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="redditApiKey">Reddit Secret Key</Label>
                <Input 
                  id="redditApiKey" 
                  value={apiKeys.redditApiKey}
                  onChange={(e) => setApiKeys({...apiKeys, redditApiKey: e.target.value})}
                  placeholder="Enter Reddit Secret Key"
                  type="password"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm font-medium">Other Services</h3>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newsIoApiKey">News.io API Key</Label>
                <Input 
                  id="newsIoApiKey" 
                  value={apiKeys.newsIoApiKey}
                  onChange={(e) => setApiKeys({...apiKeys, newsIoApiKey: e.target.value})}
                  placeholder="Enter News.io API key"
                  type="password"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="alphaVantageApiKey">AlphaVantage API Key</Label>
                <Input 
                  id="alphaVantageApiKey" 
                  value={apiKeys.alphaVantageApiKey}
                  onChange={(e) => setApiKeys({...apiKeys, alphaVantageApiKey: e.target.value})}
                  placeholder="Enter AlphaVantage API key"
                  type="password"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="etherscanApiKey">Etherscan API Key</Label>
                <Input 
                  id="etherscanApiKey" 
                  value={apiKeys.etherscanApiKey}
                  onChange={(e) => setApiKeys({...apiKeys, etherscanApiKey: e.target.value})}
                  placeholder="Enter Etherscan API key"
                  type="password"
                />
              </div>
            </div>
            
            {/* Custom API Keys Section */}
            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="text-sm font-medium">Custom API Keys</h3>
              </div>
              
              {customApiKeys.map((key, index) => (
                <div key={index} className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`custom-key-${index}`}>{key.name}</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCustomApiKey(index)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input 
                    id={`custom-key-${index}`}
                    value={key.value}
                    onChange={(e) => {
                      const updated = [...customApiKeys];
                      updated[index].value = e.target.value;
                      setCustomApiKeys(updated);
                    }}
                    placeholder={`Enter ${key.name}`}
                    type="password"
                  />
                </div>
              ))}
              
              <div className="border-t pt-4 mt-2">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="newApiKeyName" className="mb-2 block">New API Key</Label>
                    <Input 
                      id="newApiKeyName"
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                      placeholder="API Key Name"
                    />
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={newApiKey.value}
                      onChange={(e) => setNewApiKey({...newApiKey, value: e.target.value})}
                      placeholder="API Key Value"
                      type="password"
                    />
                  </div>
                  <Button
                    onClick={handleAddCustomApiKey}
                    variant="outline"
                    size="icon"
                    className="mb-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeysDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveApiKeys}>Save Keys</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
