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
    console.log('🔄 AuthContextSupabase: Inicializando...');
    
    // Obtener sesión actual
    const getCurrentSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
        } else {
          console.log('📋 Sesión actual:', session?.user?.email || 'Sin sesión');
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('❌ Error en getCurrentSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función de login
  const signIn = async (email, password) => {
    console.log('🔄 Supabase signIn:', { email });
    
    if (!email || !password) {
      throw new Error('Email y contraseña requeridos');
    }
    
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

  // Función de registro
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
    
    // Si necesita confirmación por email
    if (data.user && !data.session) {
      throw new Error('Revisa tu email para confirmar tu cuenta');
    }
    
    return data;
  };

  // Función de logout
  const signOut = async () => {
    console.log('🔄 Supabase signOut');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error en signOut:', error);
      throw error;
    }
    
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    // Utilidades adicionales
    isAuthenticated: !!user,
    userEmail: user?.email,
    userId: user?.id,
  };

  console.log('🟡 AuthContextSupabase render:', { 
    user: user?.email || 'no user', 
    loading,
    isAuthenticated: !!user 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};