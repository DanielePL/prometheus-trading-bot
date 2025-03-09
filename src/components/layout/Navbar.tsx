
import React, { useState, useEffect } from 'react';
import { Bell, Menu, Moon, Search, Settings, Sun, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyConfig } from '@/components/trading/ApiKeyConfig';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const { toast } = useToast();
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState('TB');
  const navigate = useNavigate();
  
  const [apiKeys, setApiKeys] = useState({
    exchangeApiKey: localStorage.getItem('exchangeApiKey') || '',
    exchangeApiSecret: localStorage.getItem('exchangeApiSecret') || '',
    apiEndpoint: localStorage.getItem('apiEndpoint') || 'https://api.exchange.com'
  });
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        setUserEmail(user.email);
        // Set user initials based on email
        if (user.email) {
          const parts = user.email.split('@')[0].split('.');
          if (parts.length >= 2) {
            setUserInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase());
          } else {
            setUserInitials(user.email.substring(0, 2).toUpperCase());
          }
        }
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserEmail(session.user.email);
        // Update initials when auth state changes
        if (session.user.email) {
          const parts = session.user.email.split('@')[0].split('.');
          if (parts.length >= 2) {
            setUserInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase());
          } else {
            setUserInitials(session.user.email.substring(0, 2).toUpperCase());
          }
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSaveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    localStorage.setItem('exchangeApiKey', keys.exchangeApiKey);
    localStorage.setItem('exchangeApiSecret', keys.exchangeApiSecret);
    localStorage.setItem('apiEndpoint', keys.apiEndpoint);
    
    setShowApiConfig(false);
    
    toast({
      title: "API Keys Saved",
      description: "Your exchange API configuration has been saved",
    });
    
    console.log("API configuration updated");
  };

  const handleMenuItemClick = (option: string) => {
    console.log(`Menu item clicked: ${option}`);
    
    if (option === "API Settings") {
      setShowApiConfig(true);
    } else if (option === "Logout") {
      handleLogout();
    } else {
      toast({
        title: "Settings Option Selected",
        description: `You selected: ${option}`,
      });
    }
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b">
      <div className="px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Toggle Menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search markets..."
                className="w-64 pl-8 bg-secondary/50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground"
            aria-label="Toggle Theme"
            type="button"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {!isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={handleLogin}
              type="button"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" type="button">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    <Button variant="outline" size="sm" type="button" 
                      onClick={() => handleMenuItemClick("Mark all notifications as read")}>
                      Mark all as read
                    </Button>
                  </div>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    <div className="pb-2 pt-1 border-b">
                      <p className="font-medium text-foreground">Trade Executed</p>
                      <p>BTC/USDT buy order filled at $45,230.</p>
                      <p className="text-xs mt-1">2 minutes ago</p>
                    </div>
                    <div className="pb-2 pt-1 border-b">
                      <p className="font-medium text-foreground">Strategy Alert</p>
                      <p>MACD crossover detected on ETH/USDT.</p>
                      <p className="text-xs mt-1">15 minutes ago</p>
                    </div>
                    <div className="pb-2 pt-1">
                      <p className="font-medium text-foreground">Balance Update</p>
                      <p>Portfolio value increased by 2.3%.</p>
                      <p className="text-xs mt-1">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Settings" type="button">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-md p-2">
                  <DropdownMenuItem onClick={() => handleMenuItemClick("API Settings")} className="cursor-pointer">
                    API Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Strategy Parameters")} className="cursor-pointer">
                    Strategy Parameters
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Notification Preferences")} className="cursor-pointer">
                    Notification Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Advanced Configuration")} className="cursor-pointer">
                    Advanced Configuration
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User Menu" type="button">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-accent text-accent-foreground">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-md p-2">
                  {userEmail && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground mb-1 border-b">
                      {userEmail}
                    </div>
                  )}
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Account Settings")} className="cursor-pointer">
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("API Keys")} className="cursor-pointer">
                    API Keys
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick("Logout")} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {showApiConfig && (
        <ApiKeyConfig
          apiKeys={apiKeys}
          onSave={handleSaveApiKeys}
          onCancel={() => setShowApiConfig(false)}
        />
      )}
    </nav>
  );
};
