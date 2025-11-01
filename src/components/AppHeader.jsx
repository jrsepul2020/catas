import { Wine, Bell, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import UserDropdown from './UserDropdown';

const AppHeader = () => {
  return (
    <header className="bg-gradient-to-r from-red-700 to-red-800 shadow-lg border-b border-red-600">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Wine className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Vinísima
                </h1>
                <p className="text-red-100 text-sm">
                  Sistema de Gestión de Catas
                </p>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda central */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-200 h-4 w-4" />
              <Input
                placeholder="Buscar muestras, tandas, catas..."
                className="pl-10 bg-white/10 border-red-500 text-white placeholder:text-red-200 focus:bg-white/20 focus:border-red-300"
              />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <Button
              size="sm"
              variant="ghost"
              className="relative h-10 w-10 p-0 hover:bg-white/10 text-red-100 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {/* Badge de notificaciones */}
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                3
              </span>
            </Button>

            {/* Dropdown de usuario */}
            <UserDropdown />
          </div>
        </div>

        {/* Navegación secundaria (opcional) */}
        <div className="mt-4 pt-4 border-t border-red-600 flex items-center gap-6">
          <nav className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Muestras
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Tandas
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Catas
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Estadísticas
            </Button>
          </nav>
          
          {/* Información de estado rápido */}
          <div className="ml-auto flex items-center gap-4 text-red-100 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Sistema activo</span>
            </div>
            <div>
              Última sincronización: hace 2 min
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;