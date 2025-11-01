import { supabase } from './supabaseClient';

// ============================
// FUNCIONES DE MUESTRAS
// ============================

export const muestrasAPI = {
  // Obtener todas las muestras del usuario
  getAll: async () => {
    const { data, error } = await supabase
      .from('muestras')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Obtener una muestra por ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('muestras')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Crear nueva muestra
  create: async (muestra) => {
    const { data, error } = await supabase
      .from('muestras')
      .insert([{
        ...muestra,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar muestra
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('muestras')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar muestra
  delete: async (id) => {
    const { error } = await supabase
      .from('muestras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Obtener muestras por estado
  getByEstado: async (estado) => {
    const { data, error } = await supabase
      .from('muestras')
      .select('*')
      .eq('estado', estado)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// ============================
// FUNCIONES DE TANDAS
// ============================

export const tandasAPI = {
  // Obtener todas las tandas del usuario
  getAll: async () => {
    const { data, error } = await supabase
      .from('tandas')
      .select('*')
      .order('fecha', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Obtener tandas de hoy
  getTodayTandas: async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('tandas')
      .select('*')
      .eq('fecha', today)
      .order('hora', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Crear nueva tanda
  create: async (tanda) => {
    const { data, error } = await supabase
      .from('tandas')
      .insert([{
        ...tanda,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar tanda
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('tandas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar tanda
  delete: async (id) => {
    const { error } = await supabase
      .from('tandas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// ============================
// FUNCIONES DE CATAS
// ============================

export const catasAPI = {
  // Obtener todas las catas del usuario
  getAll: async () => {
    const { data, error } = await supabase
      .from('catas')
      .select(`
        *,
        muestra:muestras(*),
        tanda:tandas(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Crear nueva cata
  create: async (cata) => {
    const { data, error } = await supabase
      .from('catas')
      .insert([{
        ...cata,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select(`
        *,
        muestra:muestras(*),
        tanda:tandas(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener catas por tanda
  getByTanda: async (tandaId) => {
    const { data, error } = await supabase
      .from('catas')
      .select(`
        *,
        muestra:muestras(*)
      `)
      .eq('tanda_id', tandaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// ============================
// FUNCIONES DE ESTADÍSTICAS
// ============================

export const estadisticasAPI = {
  // Obtener resumen general
  getResumen: async () => {
    try {
      // Obtener conteos básicos
      const [muestras, tandas, catas] = await Promise.all([
        supabase.from('muestras').select('id', { count: 'exact', head: true }),
        supabase.from('tandas').select('id', { count: 'exact', head: true }),
        supabase.from('catas').select('id', { count: 'exact', head: true })
      ]);

      // Obtener muestras pendientes
      const { count: muestrasPendientes } = await supabase
        .from('muestras')
        .select('id', { count: 'exact', head: true })
        .eq('estado', 'Pendiente');

      // Obtener tandas de hoy
      const today = new Date().toISOString().split('T')[0];
      const { count: tandasHoy } = await supabase
        .from('tandas')
        .select('id', { count: 'exact', head: true })
        .eq('fecha', today);

      return {
        totalMuestras: muestras.count || 0,
        totalTandas: tandas.count || 0,
        totalCatas: catas.count || 0,
        muestrasPendientes: muestrasPendientes || 0,
        tandasHoy: tandasHoy || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

// ============================
// FUNCIONES DE USUARIOS
// ============================

export const usuariosAPI = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (error) {
        console.error('❌ Error en usuariosAPI.getAll:', error);
        throw new Error(`Error de base de datos: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error de conexión en usuariosAPI.getAll:', error);
      
      // Si es un error de red o conexión, lanzar un error más específico
      if (error.message.includes('fetch')) {
        throw new Error('No se puede conectar con la base de datos');
      }
      
      throw error;
    }
  },

  // Obtener usuarios por rol
  getByRol: async (rol) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', rol)
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Obtener usuario por email
  getByEmail: async (email) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Verificar credenciales de usuario
  verifyCredentials: async (email, password) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('clave', password)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Email o contraseña incorrectos');
      }
      throw error;
    }
    
    return data;
  },

  // Crear nuevo usuario
  create: async (usuario) => {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar usuario
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar usuario
  delete: async (id) => {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// ============================
// FUNCIÓN DE PRUEBA
// ============================

export const testDatabaseConnection = async () => {
  try {
    console.log('🔄 Probando conexión con la base de datos...');
    
    // Intentar obtener usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol')
      .limit(3);
    
    if (error) {
      console.error('❌ Error de base de datos:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Conexión con base de datos exitosa');
    console.log('📊 Usuarios de prueba:', data);
    
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    return { success: false, error: err.message };
  }
};