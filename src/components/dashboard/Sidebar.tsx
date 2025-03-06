
import React from 'react';
import { 
  Activity, TrendingUp, BarChart2, Globe, Clock, Settings, 
  LogOut, Menu, PieChart, Database, DollarSign, User, Layers, RefreshCw
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isOpen, isActive = false }) => {
  return (
    <div 
      className={`flex items-center py-2 px-4 ${
        isActive 
          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      } transition-colors cursor-pointer`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isOpen && <span className="ml-3 text-sm font-medium">{text}</span>}
    </div>
  );
};

interface SidebarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-700">
        <Globe className="text-indigo-600 dark:text-indigo-400 mr-2" size={24} />
        {isMenuOpen && <h1 className="text-xl font-bold">Prometheus</h1>}
        <button 
          className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={toggleMenu}
        >
          <Menu size={18} />
        </button>
      </div>
      
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
        {isMenuOpen && <span>Dashboard</span>}
      </div>
      
      <nav className="flex-1">
        <SidebarItem icon={<Activity size={18} />} text="Overview" isOpen={isMenuOpen} isActive={true} />
        <SidebarItem icon={<TrendingUp size={18} />} text="Performance" isOpen={isMenuOpen} />
        <SidebarItem icon={<BarChart2 size={18} />} text="Markets" isOpen={isMenuOpen} />
        <SidebarItem icon={<Database size={18} />} text="Cloud" isOpen={isMenuOpen} />
        
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium mt-4">
          {isMenuOpen && <span>Trading</span>}
        </div>
        
        <SidebarItem icon={<Activity size={18} />} text="Strategies" isOpen={isMenuOpen} />
        <SidebarItem icon={<RefreshCw size={18} />} text="Trades" isOpen={isMenuOpen} />
        <SidebarItem icon={<Clock size={18} />} text="History" isOpen={isMenuOpen} />
        <SidebarItem icon={<PieChart size={18} />} text="Analytics" isOpen={isMenuOpen} />
        
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium mt-4">
          {isMenuOpen && <span>Account</span>}
        </div>
        
        <SidebarItem icon={<DollarSign size={18} />} text="Portfolio" isOpen={isMenuOpen} />
        <SidebarItem icon={<Layers size={18} />} text="Assets" isOpen={isMenuOpen} />
        <SidebarItem icon={<Database size={18} />} text="Deposits" isOpen={isMenuOpen} />
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-700">
        <SidebarItem icon={<User size={18} />} text="Profile" isOpen={isMenuOpen} />
        <SidebarItem icon={<Settings size={18} />} text="Settings" isOpen={isMenuOpen} />
        <SidebarItem icon={<LogOut size={18} />} text="Logout" isOpen={isMenuOpen} />
        
        {isMenuOpen && (
          <div className="text-xs text-gray-400 mt-4">
            v1.0.0
          </div>
        )}
      </div>
    </div>
  );
};
