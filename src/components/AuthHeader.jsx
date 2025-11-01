import { useAuth } from '../contexts/AuthContextDebug';
import { Button } from '../components/ui/button';
import { Wine, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const AuthHeader = () => {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
              <Wine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vinisima</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Gestión de Catas</p>
            </div>
          </div>

          {/* Información del usuario y logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">{user.email}</span>
            </div>
            
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              {loggingOut ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saliendo...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;