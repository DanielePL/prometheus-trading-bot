
import React from 'react';
import { Bell, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="outline" size="sm">Mark all as read</Button>
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
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>API Settings</DropdownMenuItem>
              <DropdownMenuItem>Strategy Parameters</DropdownMenuItem>
              <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
              <DropdownMenuItem>Advanced Configuration</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User Menu">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-accent text-accent-foreground">TB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>API Keys</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
