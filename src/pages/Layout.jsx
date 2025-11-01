

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Wine, LayoutDashboard, CalendarDays, BarChart3, Settings, LogOut, ClipboardCheck, Download } from "lucide-react";
import { useAuth } from "../contexts/AuthSimple";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Vinos Tranquilos", // Changed from "Nueva Cata"
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

// Enlaces de desarrollo/testing
const testingItems = [
  {
    title: "� Test Supabase Auth",
    url: createPageUrl("TestAuth"),
    icon: Settings,
  },
  {
    title: "�👥 Ver Usuarios",
    url: createPageUrl("ConsultaUsuarios"),
    icon: Settings,
  },
  {
    title: "🧪 Prueba Login",
    url: createPageUrl("PruebaLogin"),
    icon: LogOut,
  },
  {
    title: "🔍 Analizar Passwords",
    url: createPageUrl("AnalizarPasswords"),
    icon: Download,
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    // PWA Install handler
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <SidebarProvider>
      <style>
        {`
          [data-sidebar="sidebar"] {
            width: 13rem !important;
          }
          
          [data-sidebar="sidebar"][data-state="collapsed"] {
            width: 6rem !important;
          }
          
          [data-collapsible="icon"] {
            width: 6rem !important;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: '#fff5f5' }}>
        <Sidebar className="border-r-0 shadow-xl" collapsible="icon" style={{ backgroundColor: '#390B0B', borderRight: 'none' }}>
          <div style={{ backgroundColor: '#390B0B', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SidebarHeader className="border-b p-6 group-data-[collapsible=icon]:py-6" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#390B0B' }}>
              <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                  
                  <div className="group-data-[collapsible=icon]:hidden">
                    <h2 className="font-bold text-xl text-white">Virtus 2026</h2>
                    <p className="text-xs text-red-200/70">Gestión de Catas</p>
                  </div>
                </div>
                <SidebarTrigger className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:mt-2" style={{ color: 'white' }} />
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4 group-data-[collapsible=icon]:px-2 flex-1" style={{ backgroundColor: '#390B0B' }}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-red-200/50 uppercase tracking-wider px-3 py-3 group-data-[collapsible=icon]:hidden">
                  Navegación
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-200 rounded-xl ${
                            location.pathname === item.url 
                              ? 'text-white shadow-lg' 
                              : 'text-red-100/80 hover:text-white'
                          }`}
                          style={location.pathname === item.url ? { 
                            background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                          } : { background: 'transparent' }}
                        >
                          <Link 
                            to={item.url} 
                            className="flex items-center gap-3 px-4 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0"
                            style={{ 
                              backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              if (location.pathname !== item.url) {
                                e.currentTarget.style.color = 'rgba(254, 202, 202, 0.8)';
                              }
                            }}
                          >
                            <item.icon className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                            <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Sección de Testing/Debug */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-red-200/50 uppercase tracking-wider px-3 py-3 group-data-[collapsible=icon]:hidden">
                  🧪 Testing
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {testingItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.url}
                          className="text-red-100 hover:text-white hover:bg-red-600/50 data-[active=true]:bg-red-600 data-[active=true]:text-white"
                        >
                          <Link to={item.url}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              
                <SidebarGroup className="mt-4">
                  <SidebarGroupContent>
                    <Button
                      onClick={handleInstallPWA}
                      disabled={!deferredPrompt}
                      className="w-full text-white group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-3 disabled:opacity-50"
                      style={{ backgroundColor: '#5a1616' }}
                    >
                      <Download className="w-4 h-4 mr-2 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {deferredPrompt ? 'Instalar App' : 'Ya Instalada'}
                      </span>
                    </Button>
                  </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:py-5 mt-auto" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#390B0B' }}>
              {user && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-2 ring-red-300/30 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12" style={{ background: 'linear-gradient(135deg, #5a1616 0%, #9b1c1c 100%)' }}>
                      <span className="text-white font-semibold text-sm group-data-[collapsible=icon]:text-lg">
                        {user.nombre?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="font-semibold text-white text-sm truncate">{user.nombre || 'Usuario'}</p>
                      <p className="text-xs text-red-200/70 truncate">{user.email}</p>
                      <p className="text-xs text-red-200/50">Tablet {user.ntablet}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-200 transition-colors text-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0"
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
                    <LogOut className="w-4 h-4 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                    <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </SidebarFooter>
          </div>
        </Sidebar>

        <main className="flex-1 overflow-auto" style={{ padding: 0, margin: 0 }}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

