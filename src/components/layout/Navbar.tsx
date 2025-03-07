
import React from 'react';
import { Bell, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const { toast } = useToast();
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleMenuItemClick = (option: string) => {
    console.log(`Menu item clicked: ${option}`);
    toast({
      title: "Settings Option Selected",
      description: `You selected: ${option}`,
    });
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
              <DropdownMenuItem onClick={() => handleMenuItemClick("API Settings")}>
                API Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("Strategy Parameters")}>
                Strategy Parameters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("Notification Preferences")}>
                Notification Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("Advanced Configuration")}>
                Advanced Configuration
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User Menu" type="button">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-accent text-accent-foreground">TB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border shadow-md p-2">
              <DropdownMenuItem onClick={() => handleMenuItemClick("Profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("Account Settings")}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("API Keys")}>
                API Keys
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick("Logout")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
