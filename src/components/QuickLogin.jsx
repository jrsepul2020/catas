import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContextLocal';
import { usuariosAPI } from '../api/vinisimaAPI';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Wine, 
  User, 
  Crown, 
  ChevronDown, 
  Search,
  Lock
} from 'lucide-react';
import LoginInstructions from './LoginInstructions';

const QuickLogin = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useAuth(); // Mantenemos la referencia al contexto

  // Cargar usuarios desde Supabase (con fallback)
  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        console.log('🔄 Cargando usuarios desde Supabase...');
        setLoadingUsers(true);
        
        // Intentar cargar desde Supabase
        const data = await usuariosAPI.getAll();
        console.log('✅ Usuarios cargados:', data.length);
        
        setUsuarios(data);
      } catch (error) {
        console.warn('⚠️ Error cargando usuarios desde BD, usando datos de ejemplo:', error.message);
        
        // Fallback: usuarios de ejemplo para desarrollo
        const usuariosEjemplo = [
          {
            id: 'admin1',
            email: 'admin@vinisima.com',
            nombre: 'Administrator',
            rol: 'administrador',
            tablet: 'Tablet-Admin-01'
          },
          {
            id: 'catador1',
            email: 'catador1@vinisima.com',
            nombre: 'Ana García',
            rol: 'catador',
            tablet: 'Tablet-01'
          },
          {
            id: 'catador2',
            email: 'catador2@vinisima.com',
            nombre: 'Carlos López',
            rol: 'catador',
            tablet: 'Tablet-02'
          }
        ];
        
        setUsuarios(usuariosEjemplo);
        console.log('📋 Usando usuarios de ejemplo para desarrollo');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsuarios();
  }, []);

  // Filtrar usuarios según búsqueda
  const filteredUsers = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.tablet && user.tablet.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Agrupar por rol
  const groupedUsers = filteredUsers.reduce((acc, user) => {
    if (!acc[user.rol]) acc[user.rol] = [];
    acc[user.rol].push(user);
    return acc;
  }, {});

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': 
      case 'administrador': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'catador': return <User className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': 
      case 'administrador': return 'Administradores';
      case 'catador': return 'Catadores';
      default: return 'Usuarios';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': 
      case 'administrador': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'catador': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleQuickLogin = async (user) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Login rápido para:', user.nombre);
      
      // Simulamos un delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Crear usuario compatible con el contexto usando datos de Supabase
      const authUser = {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.nombre,
          role: user.rol,
          tablet: user.tablet,
          supabase_user_id: user.id
        },
        created_at: new Date().toISOString() // Para evitar mostrar bienvenida
      };
      
      // Guardamos en localStorage
      localStorage.setItem('current_user', JSON.stringify(authUser));
      
      console.log('✅ Login rápido exitoso para:', user.nombre, 'en tablet:', user.tablet);
      
      // Forzar recarga para que el contexto de Auth detecte el cambio
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error en login rápido:', error);
      setError('Error en el login rápido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Primero verificar credenciales en la tabla usuarios
      const user = await usuariosAPI.verifyCredentials(adminEmail, adminPassword);
      
      if (user.rol !== 'admin' && user.rol !== 'administrador') {
        throw new Error('Solo los administradores pueden usar login tradicional');
      }
      
      // Crear sesión de usuario
      const authUser = {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.nombre,
          role: user.rol,
          tablet: user.tablet,
          supabase_user_id: user.id
        },
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('current_user', JSON.stringify(authUser));
      
      console.log('✅ Login admin exitoso:', user.nombre);
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error en login admin:', error);
      setError(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-red-700 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 delay-200">
              <Wine className="w-10 h-10 text-white" />
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Vinísima - Acceso Rápido
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-base">
              Selecciona tu perfil para iniciar sesión rápidamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {loadingUsers ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Barra de búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, rol o tablet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                {/* Lista de usuarios agrupados */}
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {Object.entries(groupedUsers).map(([role, users]) => (
                    <div key={role} className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        {getRoleIcon(role)}
                        <span className="font-semibold text-gray-700">
                          {getRoleLabel(role)} ({users.length})
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {users.map((user) => (
                          <Button
                            key={user.id}
                            onClick={() => handleQuickLogin(user)}
                            disabled={loading}
                            variant="outline"
                            className="h-auto p-4 text-left hover:bg-red-50 hover:border-red-300 transition-all duration-200 transform hover:scale-105"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {getRoleIcon(user.rol)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">
                                  {user.nombre}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`text-xs px-2 py-1 rounded border ${getRoleBadgeColor(user.rol)}`}>
                                    {user.rol}
                                  </div>
                                  {user.tablet && (
                                    <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300">
                                      📱 {user.tablet}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron usuarios con ese criterio de búsqueda
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botón para login admin */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setShowAdminLogin(!showAdminLogin)}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Login de Administrador
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdminLogin ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

                {/* Login admin tradicional */}
                {showAdminLogin && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-4">
                      Para administradores con credenciales personalizadas
                    </div>
                    
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Email de administrador"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                      
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        className="h-12"
                      />
                      
                      <Button
                        type="submit"
                        disabled={loading || !adminEmail || !adminPassword}
                        className="w-full h-12 bg-red-700 hover:bg-red-800"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verificando...
                          </div>
                        ) : (
                          'Iniciar Sesión como Admin'
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Instrucciones de uso */}
                <LoginInstructions />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickLogin;