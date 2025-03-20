
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-sm", className)}>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="h-9 w-9 rounded-full bg-clinic-700 text-white flex items-center justify-center text-sm font-medium">
          DR
        </div>
      </div>
    </header>
  );
};

export default Header;
