
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MarketSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const MarketSearch = ({ searchTerm, setSearchTerm }: MarketSearchProps) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search markets..." 
        className="pl-8" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
