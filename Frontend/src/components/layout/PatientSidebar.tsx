
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  CalendarPlus, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FileText, 
  User,
  Menu,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PatientSidebarProps {
  className?: string;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { name: 'Bills', path: '/patient/bills', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-md bg-white shadow-elevation-1 border flex items-center justify-center lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full z-40 bg-background border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="h-16 border-b flex items-center px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-clinic-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">CM</span>
            </div>
            <div className={cn("flex flex-col transition-opacity", collapsed ? "opacity-0" : "opacity-100")}>
              <span className="font-semibold">Clinic Management</span>
              <span className="text-xs text-muted-foreground">Patient Portal</span>
            </div>
          </div>
        </div>

        <div className="py-6 px-3 flex flex-col h-[calc(100%-4rem)]">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors relative group",
                  isActive 
                    ? "text-clinic-700 bg-clinic-50 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className={cn("transition-opacity", collapsed ? "opacity-0 invisible" : "opacity-100 visible")}>
                  {item.name}
                </span>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 shadow-elevation-1">
                    {item.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 shadow-elevation-1">
                  Logout
                </div>
              )}
            </button>
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center rounded-md p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              {!collapsed && <span className="ml-2">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;
