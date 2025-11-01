import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/base44Client';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Usuarios de ejemplo (fallback)
const usuariosEjemplo = [
  {
    id: 'admin1',
    email: 'admin@vinisima.com',
    nombre: 'Administrator',
    rol: 'administrador',
    ntablet: 'Tablet-Admin-01'
  },
  {
    id: 'catador1',
    email: 'ana@vinisima.com',
    nombre: 'Ana García',
    rol: 'catador',
    ntablet: 'Tablet-01'
  },
  {
    id: 'catador2',
    email: 'carlos@vinisima.com',
    nombre: 'Carlos López',
    rol: 'catador',
    ntablet: 'Tablet-02'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios al iniciar
  useEffect(() => {
    const loadUsuarios = async () => {
      console.log('🔄 Iniciando carga de usuarios...');
      
      try {
        console.log('🔄 Conectando con Supabase...');
        
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .order('nombre', { ascending: true });
        
        console.log('📊 Respuesta de Supabase:', { data, error });
        
        if (error) {
          console.error('❌ Error de Supabase:', error);
          console.log('📋 Usando usuarios de ejemplo por error');
          console.log('📋 Usuarios de ejemplo a cargar:', usuariosEjemplo.length);
          setUsuarios([...usuariosEjemplo]); // Forzar nueva referencia
        } else if (!data || data.length === 0) {
          console.warn('⚠️ Tabla usuarios vacía o sin datos');
          console.log('📋 Usando usuarios de ejemplo por tabla vacía');
          console.log('📋 Usuarios de ejemplo a cargar:', usuariosEjemplo.length);
          setUsuarios([...usuariosEjemplo]); // Forzar nueva referencia
        } else {
          console.log('✅ Usuarios cargados desde Supabase:', data.length);
          console.log('📋 Primer usuario:', data[0]);
          setUsuarios(data);
        }
      } catch (error) {
        console.error('❌ Error de conexión crítico:', error);
        console.log('📋 Usando usuarios de ejemplo por error de conexión');
        console.log('📋 Usuarios de ejemplo a cargar:', usuariosEjemplo.length);
        setUsuarios([...usuariosEjemplo]); // Forzar nueva referencia
      } finally {
        console.log('✅ Proceso de carga completado');
        setLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  // Login rápido (seleccionar usuario)
  const quickLogin = async (userData) => {
    console.log('🔄 Login rápido:', userData.nombre);
    setUser(userData);
  };

  // Logout
  const signOut = async () => {
    console.log('🔄 Logout');
    setUser(null);
  };

  const value = {
    user,
    usuarios,
    loading,
    quickLogin,
    signOut,
    // Utilidades
    isAuthenticated: !!user,
    userName: user?.nombre,
    userRole: user?.rol || 'catador',
    userTablet: user?.ntablet || 'Sin asignar',
    isAdmin: user?.rol === 'administrador',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};