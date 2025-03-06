
import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Example notification that could be triggered by bot events
  React.useEffect(() => {
    // Simulating a notification after component mount
    const timer = setTimeout(() => {
      toast({
        title: "Prometheus Trade Bot status",
        description: "Bot is running and monitoring markets",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-grow px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Prometheus Trade Bot Interface. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
