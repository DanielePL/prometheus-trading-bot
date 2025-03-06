import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, ArrowLeftRight, BarChart2, Briefcase, ChevronLeft, ChevronRight, 
  CreditCard, Github, Globe, History, Home, LineChart, LogOut, 
  Settings, TrendingUp, User, Wallet, Cloud 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => (
  <Link to={to} className="w-full">
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal",
        active ? "bg-accent/50 text-accent-foreground" : "hover:bg-accent/20"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  </Link>
);

const SidebarSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="space-y-1 py-2">
    <h3 className="px-4 text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    {children}
  </div>
);

export const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 border-r bg-card",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
          "flex flex-col"
        )}
      >
        {/* Logo Area */}
        <div className="py-6 px-4 flex justify-between items-center border-b h-16">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <>
                <Globe className="h-6 w-6 text-accent" />
                <span className="font-bold text-lg">Prometheus</span>
              </>
            ) : (
              <Globe className="h-6 w-6 mx-auto text-accent" />
            )}
          </div>
          <Button 
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hidden md:flex" 
            onClick={toggleSidebar}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <SidebarSection title={isOpen ? "Dashboard" : ""}>
            <SidebarItem icon={Home} label="Overview" to="/" active={currentPath === '/'} />
            <SidebarItem icon={Activity} label="Performance" to="/performance" active={currentPath === '/performance'} />
            <SidebarItem icon={BarChart2} label="Markets" to="/markets" active={currentPath === '/markets'} />
            <SidebarItem icon={Cloud} label="Cloud" to="/cloud" active={currentPath === '/cloud'} />
          </SidebarSection>
          
          <SidebarSection title={isOpen ? "Trading" : ""}>
            <SidebarItem icon={TrendingUp} label="Strategies" to="/strategies" active={currentPath === '/strategies'} />
            <SidebarItem icon={ArrowLeftRight} label="Trades" to="/trades" active={currentPath === '/trades'} />
            <SidebarItem icon={History} label="History" to="/history" active={currentPath === '/history'} />
            <SidebarItem icon={LineChart} label="Analytics" to="/analytics" active={currentPath === '/analytics'} />
          </SidebarSection>
          
          <SidebarSection title={isOpen ? "Account" : ""}>
            <SidebarItem icon={Briefcase} label="Portfolio" to="/portfolio" active={currentPath === '/portfolio'} />
            <SidebarItem icon={Wallet} label="Assets" to="/assets" active={currentPath === '/assets'} />
            <SidebarItem icon={CreditCard} label="Deposits" to="/deposits" active={currentPath === '/deposits'} />
          </SidebarSection>
        </div>
        
        {/* Footer */}
        <div className="border-t py-2 px-2">
          <SidebarItem icon={User} label="Profile" to="/profile" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive",
              !isOpen && "justify-center p-2"
            )}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span>Logout</span>}
          </Button>
        </div>
        
        <div className="py-2 px-4 text-xs text-muted-foreground border-t">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <span>v1.0.0</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="flex justify-center">
              <Github className="h-4 w-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
