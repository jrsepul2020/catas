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
  X
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
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showDebug, setShowDebug] = React.useState(true);

  React.useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      console.log('✅ App ya instalada (standalone mode)');
    }

    // PWA Install handler
    const handler = (e) => {
      e.preventDefault();
      console.log('🎯 beforeinstallprompt event recibido!');
      setDeferredPrompt(e);
      setIsInstalled(false);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // Detect if app was installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ App instalada exitosamente!');
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    
    console.log('👂 Escuchando evento beforeinstallprompt...');
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff5f5' }}>
      {/* Sidebar - Desktop */}
      <aside 
        className="hidden md:fixed md:flex md:flex-col md:w-64 md:h-screen md:shadow-xl md:z-40"
        style={{ backgroundColor: '#390B0B' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h2 className="font-bold text-xl text-white">Virtus 2026</h2>
          <p className="text-xs text-red-200/70">Gestión de Catas</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)'
                      : 'transparent',
                    color: isActive ? 'white' : 'rgba(254, 202, 202, 0.8)',
                    boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(254, 202, 202, 0.8)';
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* PWA Install Button */}
          <div className="mt-6 space-y-2">
            {/* Botón principal de instalación */}
            {deferredPrompt && !isInstalled && (
              <button
                onClick={handleInstallPWA}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{ 
                  backgroundColor: '#5a1616',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7a1c1c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a1616';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Download className="w-5 h-5" />
                <span>Instalar App</span>
              </button>
            )}
            
            {/* Mensaje cuando está instalada */}
            {isInstalled && (
              <div className="bg-green-900/30 border border-green-600/30 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-green-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">App instalada</span>
                </div>
              </div>
            )}
            
            {/* Debug info - temporal */}
            {!deferredPrompt && !isInstalled && (
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-3">
                <p className="text-xs text-yellow-200/70 text-center">
                  ℹ️ PWA no disponible en este navegador o ya instalada
                </p>
                <p className="text-xs text-yellow-200/50 text-center mt-1">
                  Usa Chrome/Edge en HTTPS
                </p>
              </div>
            )}
          </div>
        </nav>

        {/* Footer - User Info */}
        {user && (
          <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-2 ring-red-300/30"
                style={{ background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' }}
              >
                <span className="text-white font-semibold text-sm">
                  {user.nombre?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{user.nombre || 'Usuario'}</p>
                <p className="text-xs text-red-200/70 truncate">{user.email}</p>
                <p className="text-xs text-red-200/50">Tablet {user.ntablet}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-200 transition-colors text-sm"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgb(254, 202, 202)';
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md flex items-center justify-between" style={{ backgroundColor: '#390B0B' }}>
        <h2 className="font-bold text-lg text-white">Virtus 2026</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-white hover:bg-white/10"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 flex"
          onClick={() => setIsOpen(false)}
        >
          <aside 
            className="w-64 h-screen shadow-xl flex flex-col"
            style={{ backgroundColor: '#390B0B' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <h2 className="font-bold text-xl text-white">Virtus 2026</h2>
              <p className="text-xs text-red-200/70">Gestión de Catas</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)'
                          : 'transparent',
                        color: isActive ? 'white' : 'rgba(254, 202, 202, 0.8)',
                        boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {/* PWA Install Button */}
              {deferredPrompt && !isInstalled && (
                <div className="mt-6">
                  <button
                    onClick={handleInstallPWA}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium shadow-lg"
                    style={{ 
                      backgroundColor: '#5a1616',
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Instalar App</span>
                  </button>
                </div>
              )}
              {isInstalled && (
                <div className="mt-6 bg-green-900/30 border border-green-600/30 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">App instalada</span>
                  </div>
                </div>
              )}
            </nav>

            {/* Footer - User Info */}
            {user && (
              <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-2 ring-red-300/30"
                    style={{ background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {user.nombre?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{user.nombre || 'Usuario'}</p>
                    <p className="text-xs text-red-200/70 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-200 text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
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

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
