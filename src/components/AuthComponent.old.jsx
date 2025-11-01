import { useState, useEffect } from 'react';
import { UsuarioCustom } from '../api/usuarioCustom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wine } from "lucide-react";

export default function AuthComponent({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Verificar si hay usuario autenticado al cargar
  useEffect(() => {
    checkUser();
    
    // Escuchar cambios de autenticación
    const unsubscribe = UsuarioCustom.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkUser = () => {
    try {
      const currentUser = UsuarioCustom.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        console.log('✅ Usuario autenticado:', currentUser.email || currentUser.username);
      } else {
        console.log('🔓 No hay usuario autenticado');
      }
    } catch (err) {
      console.error('Error verificando usuario:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Intentando login...');
      const result = await UsuarioCustom.signIn(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login exitoso:', result.user);
        setUser(result.user);
      } else {
        setError(result.error || 'Error de autenticación');
        console.error('❌ Login fallido:', result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
      console.error('❌ Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await UsuarioCustom.signOut();
      setUser(null);
      console.log('✅ Sesión cerrada');
    } catch (err) {
      setError(err.message);
      console.error('❌ Error al cerrar sesión:', err);
    }
  };

  // Mostrar loading inicial
  if (loading && user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
            <Wine className="w-8 h-8 text-red-700" />
          </div>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando Vinisima...</p>
        </div>
      </div>
    );
  }

  // Si hay usuario, mostrar el contenido principal
  if (user) {
    return (
      <div>
        {/* Barra de usuario en la parte superior */}
        <div className="bg-red-50 border-b px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            👤 Bienvenido, <strong>{user.email || user.nombre || user.username || 'Usuario'}</strong>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-700 border-red-200 hover:bg-red-100"
          >
            Cerrar Sesión
          </Button>
        </div>
        
        {children}
      </div>
    );
  }

  // Mostrar formulario de autenticación
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
            <Wine className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Vinisima
          </CardTitle>
          <p className="text-gray-600">
            Sistema de Gestión de Catas de Vino
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email / Usuario</Label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Ingresa tu email o usuario"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
            </div>
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2.5" 
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>💡 <strong>Consejo:</strong> Usa las credenciales de tu tabla usuarios</p>
              <p>🔧 El sistema detectará automáticamente el tipo de hash</p>
              <p>🖥️ Revisa la consola del navegador para más detalles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}