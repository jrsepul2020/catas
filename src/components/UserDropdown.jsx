import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextLocal';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react';

const UserDropdown = () => {
  const { user, signOut, userName, userRole, userTablet } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (userName) {
      const names = userName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  // Obtener nombre de usuario
  const getUserName = () => {
    return userName || user?.email?.split('@')[0] || 'Usuario';
  };

  // Obtener color del rol
  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return 'text-yellow-700 bg-yellow-100';
      case 'catador_senior': return 'text-purple-700 bg-purple-100';
      case 'catador': return 'text-blue-700 bg-blue-100';
      case 'tecnico': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  // Obtener label del rol
  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Administrador';
      case 'catador_senior': return 'Catador Senior';
      case 'catador': return 'Catador';
      case 'tecnico': return 'Técnico';
      default: return 'Usuario';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 h-12 px-4 hover:bg-white/10 transition-all duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-red-600 text-white font-semibold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-start">
            <span className="text-white font-medium text-sm">
              {getUserName()}
            </span>
            <span className="text-red-100 text-xs">
              {userTablet || user?.email}
            </span>
          </div>
          
          <ChevronDown className="h-4 w-4 text-red-100 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="flex items-center gap-3 p-3 bg-red-50 rounded-lg mb-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-red-600 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {getUserName()}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor()}`}>
                {getRoleLabel()}
              </span>
            </div>
            {user?.email && (
              <span className="text-xs text-gray-500 mt-1">
                {user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg">
          <User className="h-4 w-4 text-red-600" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg">
          <BarChart3 className="h-4 w-4 text-red-600" />
          <span>Estadísticas</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg">
          <Calendar className="h-4 w-4 text-red-600" />
          <span>Mis Tandas</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg">
          <FileText className="h-4 w-4 text-red-600" />
          <span>Mis Catas</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg">
          <Settings className="h-4 w-4 text-red-600" />
          <span>Configuración</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
        >
          {isLoggingOut ? (
            <>
              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span>Cerrando sesión...</span>
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;