import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleProfileClick = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.role === 'patient') {
      navigate('/patient/profile');
    } else if (user && user.role === 'admin') {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm); // Replace with actual search logic (e.g., navigate to a search results page)
      // Example: navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-16 px-6 flex items-center justify-between sticky top-0 z-30",
        className
      )}
      style={{ background: 'linear-gradient(180deg, #F7FAFF, #F0F7FF)' }} // clinic-50 to clinic-100
    >
      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clinic-600" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-clinic-50 border border-clinic-200 text-black placeholder-clinic-800 focus:ring-2 focus:ring-clinic-400 focus:border-transparent transition-all ripple"
          />
        </form>
      </div>
      
      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-clinic-50 transition-colors ripple"
        >
          <Bell className="h-5 w-5 text-clinic-600" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
        </motion.button>
        
        <motion.button
          onClick={handleProfileClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-9 w-9 rounded-full bg-clinic-600 text-white flex items-center justify-center text-sm font-medium hover:bg-clinic-700 transition-colors ripple"
        >
          DR
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;