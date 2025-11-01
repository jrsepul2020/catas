import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext({});

// Usuarios de ejemplo para desarrollo (estructura compatible con Supabase)
const usuariosEjemplo = [
  {
    id: 'admin1',
    email: 'admin@vinisima.com',
    nombre: 'Administrator',
    rol: 'administrador',
    ntablet: 'Tablet-Admin-01',
    tablet: 'Tablet-Admin-01', // Para compatibilidad
    user_metadata: {
      name: 'Administrator',
      role: 'administrador',
      tablet: 'Tablet-Admin-01'
    }
  },
  {
    id: 'catador1',
    email: 'ana@vinisima.com',
    nombre: 'Ana García',
    rol: 'catador',
    ntablet: 'Tablet-01',
    tablet: 'Tablet-01', // Para compatibilidad
    user_metadata: {
      name: 'Ana García',
      role: 'catador',
      tablet: 'Tablet-01'
    }
  },
  {
    id: 'catador2',
    email: 'carlos@vinisima.com',
    nombre: 'Carlos López',
    rol: 'catador',
    ntablet: 'Tablet-02',
    tablet: 'Tablet-02', // Para compatibilidad
    user_metadata: {
      name: 'Carlos López',
      role: 'catador',
      tablet: 'Tablet-02'
    }
  },
  {
    id: 'catador3',
    email: 'maria@vinisima.com',
    nombre: 'María Rodríguez',
    rol: 'catador',
    ntablet: 'Tablet-03',
    tablet: 'Tablet-03', // Para compatibilidad
    user_metadata: {
      name: 'María Rodríguez',
      role: 'catador',
      tablet: 'Tablet-03'
    }
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios desde Supabase
  useEffect(() => {
    console.log('🔄 AuthContextSimple: Inicializando...');
    
    const loadUsuarios = async () => {
      try {
        console.log('🔄 Cargando usuarios desde Supabase...');
        
        // Primero intentar una conexión simple para verificar que funciona
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, email, nombre, rol, ntablet')
          .order('nombre', { ascending: true });
        
        if (error) {
          console.warn('⚠️ Error cargando usuarios desde Supabase:', error.message);
          console.log('📋 Usando usuarios de ejemplo como fallback');
          setUsuarios(usuariosEjemplo);
        } else if (!data || data.length === 0) {
          console.warn('⚠️ No se encontraron usuarios en la tabla');
          console.log('📋 Usando usuarios de ejemplo como fallback');
          setUsuarios(usuariosEjemplo);
        } else {
          console.log('✅ Usuarios cargados desde Supabase:', data.length);
          console.log('📋 Primer usuario:', data[0]);
          
          // Transformar datos de Supabase al formato esperado
          const usuariosTransformados = data.map(usuario => ({
            ...usuario,
            tablet: usuario.ntablet, // Mapear ntablet a tablet para compatibilidad
            user_metadata: {
              name: usuario.nombre,
              role: usuario.rol,
              tablet: usuario.ntablet
            }
          }));
          setUsuarios(usuariosTransformados);
        }
      } catch (error) {
        console.error('❌ Error de conexión con Supabase:', error);
        console.log('📋 Usando usuarios de ejemplo como fallback');
        setUsuarios(usuariosEjemplo);
      } finally {
        console.log('✅ Carga de usuarios completada');
        setLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  // Función para login rápido
  const quickLogin = async (userData) => {
    console.log('🔄 Quick login:', userData.nombre);
    setLoading(true);
    
    // Simular delay de carga
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setUser(userData);
    setLoading(false);
    
    console.log('✅ Login exitoso:', userData.nombre);
  };

  // Función para logout
  const signOut = async () => {
    console.log('🔄 SignOut');
    setUser(null);
    console.log('✅ SignOut exitoso');
  };

  const value = {
    user,
    loading,
    usuarios, // Lista dinámica desde Supabase o fallback
    usuariosEjemplo, // Mantener fallback disponible
    quickLogin,
    signOut,
    // Utilidades adicionales
    isAuthenticated: !!user,
    userEmail: user?.email,
    userId: user?.id,
    userName: user?.nombre || user?.user_metadata?.name,
    userRole: user?.rol || user?.user_metadata?.role || 'catador',
    userTablet: user?.tablet || user?.ntablet || user?.user_metadata?.tablet || 'Sin asignar',
    isAdmin: user?.rol === 'administrador' || user?.user_metadata?.role === 'administrador',
  };

  console.log('🟡 AuthContextSimple render:', { user: user?.email || 'no user', loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};