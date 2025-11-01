import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext({});

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
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('🔄 AuthContextLocal: Inicializando...');
    
    const initializeAuth = async () => {
      try {
        // Primero verificar si hay un usuario mock guardado localmente
        const localUser = localStorage.getItem('current_user');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            console.log('📋 Usuario local encontrado:', parsedUser.user_metadata?.name);
            setUser(parsedUser);
            setSession({ user: parsedUser });
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('❌ Error parseando usuario local:', parseError);
            localStorage.removeItem('current_user');
          }
        }

        // Si no hay usuario local, verificar sesión de Supabase solo si tenemos credenciales válidas
        if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'your-supabase-project-url') {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              console.warn('⚠️ Error conectando con Supabase (funciona sin él):', error.message);
            } else if (session) {
              console.log('📋 Sesión Supabase encontrada:', session.user?.email);
              setSession(session);
              setUser(session.user);
            } else {
              console.log('📋 No hay sesión activa');
            }
          } catch (supabaseError) {
            console.warn('⚠️ Supabase no disponible (funciona sin él):', supabaseError.message);
          }
        } else {
          console.log('📋 Usando modo offline (sin Supabase configurado)');
        }
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'No user');
        
        // Si hay cambio en Supabase, limpiar usuario local
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          localStorage.removeItem('current_user');
        }
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función de login tradicional (para administradores)
  const signIn = async (email, password) => {
    console.log('🔄 Supabase signIn:', { email });
    
    if (!email || !password) {
      throw new Error('Email y contraseña requeridos');
    }

    // Limpiar usuario local si existe
    localStorage.removeItem('current_user');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Error en signIn:', error);
      throw error;
    }

    console.log('✅ SignIn exitoso:', data.user?.email);
    return data;
  };

  // Función de registro (solo para administradores)
  const signUp = async (email, password) => {
    console.log('🔄 Supabase signUp:', { email });
    
    if (!email || !password) {
      throw new Error('Email y contraseña requeridos');
    }
    
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ Error en signUp:', error);
      throw error;
    }

    console.log('✅ SignUp exitoso:', data.user?.email);
    
    if (data.user && !data.session) {
      throw new Error('Revisa tu email para confirmar tu cuenta');
    }
    
    return data;
  };

  // Función de logout (ambos tipos)
  const signOut = async () => {
    console.log('🔄 SignOut');
    
    // Limpiar usuario local
    localStorage.removeItem('current_user');
    
    // Limpiar sesión de Supabase si existe
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error en signOut:', error);
      // No lanzar error aquí, porque el logout local ya se hizo
    }
    
    // Forzar actualización del estado
    setUser(null);
    setSession(null);
    
    console.log('✅ SignOut exitoso');
  };

  // Función para resetear contraseña
  const resetPassword = async (email) => {
    console.log('🔄 Supabase resetPassword:', { email });
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('❌ Error en resetPassword:', error);
      throw error;
    }

    console.log('✅ Email de reset enviado');
  };

  // Función para login rápido (usuarios predefinidos)
  const quickLogin = async (userData) => {
    console.log('🔄 Quick login:', userData.name);
    
    // Guardar usuario mock en localStorage
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    // Actualizar estado
    setUser(userData);
    setSession({ user: userData });
    
    console.log('✅ Quick login exitoso');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    quickLogin,
    // Utilidades adicionales
    isAuthenticated: !!user,
    userEmail: user?.email,
    userId: user?.id,
    userName: user?.user_metadata?.name || user?.email?.split('@')[0],
    userRole: user?.user_metadata?.role || 'catador',
    userTablet: user?.user_metadata?.tablet || 'Sin asignar',
    isAdmin: user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'administrador',
    isLocal: !!user?.user_metadata?.supabase_user_id, // Indica si es usuario local vs Supabase auth
  };

  console.log('🟡 AuthContextLocal render:', { 
    user: user?.user_metadata?.name || user?.email || 'no user', 
    loading,
    isAuthenticated: !!user,
    role: user?.user_metadata?.role || 'unknown'
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};