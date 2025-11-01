import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Wine, 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  LogOut, 
  ClipboardCheck, 
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthSimple";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Vinos Tranquilos",
    url: createPageUrl("NuevaCata"),
    icon: ClipboardCheck,
  },
  {
    title: "Cata Espirituosos",
    url: createPageUrl("CataEspirituosos"),
    icon: Wine,
  },
  {
    title: "Tandas",
    url: createPageUrl("Tandas"),
    icon: CalendarDays,
  },
  {
    title: "Estadísticas",
    url: createPageUrl("Estadisticas"),
    icon: BarChart3,
  },
  {
    title: "Configuración",
    url: createPageUrl("Configuracion"),
    icon: Settings,
  },
];

export default function LayoutNew({ children }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-56';
  const sidebarWidthClass = isCollapsed ? 'md:ml-16' : 'md:ml-56';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff5f5' }}>
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:fixed md:flex md:flex-col ${sidebarWidth} md:h-screen md:shadow-xl md:z-40 transition-all duration-300`}
        style={{ backgroundColor: '#390B0B' }}
      >
        <div className={`p-4 border-b flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`} style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-base text-white">Virtus 2026</h2>
              <p className="text-xs text-red-200/70">Gestión de Catas</p>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 rounded-lg text-white hover:bg-white/10">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <Link key={item.title} to={item.url}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isCollapsed ? 'justify-center' : ''}`}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(254, 202, 202, 0.8)',
                    boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'
                  }}
                  title={isCollapsed ? item.title : ''}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                </Link>
              );
            })}
          </div>

          {!isCollapsed && deferredPrompt && !isInstalled && (
            <button onClick={handleInstallPWA}
              className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium shadow-lg"
              style={{ backgroundColor: '#5a1616', border: '2px solid rgba(255,255,255,0.2)' }}
            >
              <Download className="w-4 h-4" />
              <span>Instalar App</span>
            </button>
          )}
        </nav>

        {user && (
          <div className="p-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-red-300/30"
                style={{ background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' }}>
                <span className="text-white font-semibold text-xs">{user.nombre?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-xs truncate">{user.nombre}</p>
                  <p className="text-xs text-red-200/50">Tablet {user.ntablet}</p>
                </div>
              )}
            </div>
            <button onClick={() => signOut()}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} px-3 py-2 rounded-lg text-white font-medium text-xs`}
              style={{ backgroundColor: '#7a1c1c' }}
              title={isCollapsed ? 'Cerrar Sesión' : ''}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md flex items-center justify-between" style={{ backgroundColor: '#390B0B' }}>
        <h2 className="font-bold text-lg text-white">Virtus 2026</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-white hover:bg-white/10">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setIsOpen(false)}>
          <aside className="w-64 h-screen shadow-xl flex flex-col" style={{ backgroundColor: '#390B0B' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <h2 className="font-bold text-base text-white">Virtus 2026</h2>
              <p className="text-xs text-red-200/70">Gestión de Catas</p>
            </div>
            <nav className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <Link key={item.title} to={item.url} onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' : 'transparent',
                        color: isActive ? 'white' : 'rgba(254, 202, 202, 0.8)',
                        boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
            {user && (
              <div className="p-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-red-300/30"
                    style={{ background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' }}>
                    <span className="text-white font-semibold text-xs">{user.nombre?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-xs truncate">{user.nombre}</p>
                    <p className="text-xs text-red-200/50">Tablet {user.ntablet}</p>
                  </div>
                </div>
                <button onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white font-medium text-xs"
                  style={{ backgroundColor: '#7a1c1c' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </aside>
          <div className="flex-1 bg-black/50" />
        </div>
      )}

      <main className={`${sidebarWidthClass} min-h-screen pt-16 md:pt-0 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}
