
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Key, Globe, BellRing, Shield, Moon, Sun } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ApiKeyConfig } from '@/components/trading/ApiKeyConfig';

export const SettingsDrawer: React.FC = () => {
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  
  const [apiKeys, setApiKeys] = useState({
    exchangeApiKey: localStorage.getItem('exchangeApiKey') || '',
    exchangeApiSecret: localStorage.getItem('exchangeApiSecret') || '',
    apiEndpoint: localStorage.getItem('apiEndpoint') || 'https://cors-proxy.fringe.zone/https://api.kraken.com'
  });
  
  const handleSaveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    setShowApiConfig(false);
    
    // Force a page reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" className="rounded-full w-12 h-12 bg-primary shadow-lg hover:bg-primary/90">
            <Settings className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mx-auto max-w-sm">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Quick Settings</h3>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowApiConfig(true)}
              >
                <Key className="h-4 w-4 mr-2" />
                Configure API Keys
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <><Moon className="h-4 w-4 mr-2" /> Switch to Dark Mode</>
                ) : (
                  <><Sun className="h-4 w-4 mr-2" /> Switch to Light Mode</>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled
              >
                <BellRing className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled
              >
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled
              >
                <Globe className="h-4 w-4 mr-2" />
                Language Settings
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      {showApiConfig && (
        <ApiKeyConfig
          apiKeys={apiKeys}
          onSave={handleSaveApiKeys}
          onCancel={() => setShowApiConfig(false)}
        />
      )}
    </div>
  );
};
