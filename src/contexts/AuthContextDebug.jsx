import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Función para obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        console.log('🟡 Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
        } else {
          console.log('✅ Sesión obtenida:', session ? 'logueado' : 'no logueado');
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('❌ Error en getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    console.log('🟡 Configurando listener de auth...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    console.log('🟡 Intentando signIn:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('🔄 SignIn result:', data ? 'success' : 'failed', error?.message);
    return { data, error };
  };

  const signUp = async (email, password) => {
    console.log('🟡 Intentando signUp:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log('🔄 SignUp result:', data ? 'success' : 'failed', error?.message);
    return { data, error };
  };

  const signOut = async () => {
    console.log('🟡 Intentando signOut...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error cerrando sesión:', error);
    } else {
      console.log('✅ SignOut exitoso');
    }
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log('🔄 AuthContext render:', { 
    user: user?.email || 'no user', 
    loading, 
    session: session ? 'exists' : 'null' 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;