
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Briefcase,
  History,
  Settings,
  PieChart,
  Zap,
  ScanSearch,
  Globe,
  Shield,
  Layers,
  Clock,
  Newspaper,
  Cloud,
  CircleDollarSign,
  UserCircle,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Close sidebar on route change on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Group 1: Main Navigation
  const mainNavItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Markets",
      href: "/markets",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Trading Bot",
      href: "/trading-bot",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Advanced Trading",
      href: "/advanced-trading",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      title: "News Scanner",
      href: "/news-scanner",
      icon: <ScanSearch className="w-5 h-5" />,
    },
  ];

  // Group 2: Analysis and Tools
  const analysisNavItems = [
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Performance",
      href: "/performance",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Strategies",
      href: "/strategies",
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      title: "Trade History",
      href: "/history",
      icon: <History className="w-5 h-5" />,
    },
  ];

  // Group 3: Account and Settings
  const accountNavItems = [
    {
      title: "Deposits",
      href: "/deposits",
      icon: <CircleDollarSign className="w-5 h-5" />,
    },
    {
      title: "Cloud Sync",
      href: "/cloud",
      icon: <Cloud className="w-5 h-5" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <UserCircle className="w-5 h-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Main
          </h2>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-start w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent",
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Analysis
          </h2>
          <div className="space-y-1">
            {analysisNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-start w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent",
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            {accountNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-start w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent",
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
