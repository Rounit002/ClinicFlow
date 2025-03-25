import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  FileText, 
  Settings,
  Menu,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Billing', path: '/billing', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];  

  const handleLogout = async () => {
    try {
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-md bg-white shadow border flex items-center justify-center lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

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
              <span className="text-xs text-muted-foreground">Admin Portal</span>
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
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center rounded-md p-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Logout</span>}
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

export default Sidebar;