// Función utilitaria para poblar usuarios directamente
import { supabase } from '../api/base44Client';

// Usuarios que vamos a insertar
const usuariosParaInsertar = [
  {
    email: 'admin@vinisima.com',
    clave: 'admin123',
    nombre: 'Administrator',
    rol: 'administrador',
    ntablet: 1
  },
  {
    email: 'ana.garcia@vinisima.com',
    clave: 'ana123',
    nombre: 'Ana García',
    rol: 'catador',
    ntablet: 2
  },
  {
    email: 'carlos.lopez@vinisima.com',
    clave: 'carlos123',
    nombre: 'Carlos López',
    rol: 'catador',
    ntablet: 3
  },
  {
    email: 'maria.rodriguez@vinisima.com',
    clave: 'maria123',
    nombre: 'María Rodríguez',
    rol: 'catador',
    ntablet: 4
  },
  {
    email: 'juan.perez@vinisima.com',
    clave: 'juan123',
    nombre: 'Juan Pérez',
    rol: 'catador',
    ntablet: 5
  }
];

// Función para insertar usuarios
export const insertarUsuariosReales = async () => {
  console.log('🚀 Iniciando inserción de usuarios...');
  
  try {
    // Verificar si ya existen usuarios
    const { data: existingUsers, error: checkError } = await supabase
      .from('usuarios')
      .select('*');
      
    if (checkError) {
      throw new Error(`Error verificando usuarios: ${checkError.message}`);
    }
    
    console.log(`📊 Usuarios existentes: ${existingUsers?.length || 0}`);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('⚠️ Ya existen usuarios en la tabla');
      return { success: false, message: 'Ya existen usuarios' };
    }
    
    // Insertar todos los usuarios de una vez
    const { data, error } = await supabase
      .from('usuarios')
      .insert(usuariosParaInsertar)
      .select();
      
    if (error) {
      throw new Error(`Error insertando usuarios: ${error.message}`);
    }
    
    console.log('✅ Usuarios insertados exitosamente:', data);
    return { success: true, data, message: `${data.length} usuarios insertados` };
    
  } catch (error) {
    console.error('💥 Error:', error);
    return { success: false, error: error.message };
  }
};

// Función para verificar usuarios
export const verificarUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('id');
      
    if (error) {
      throw new Error(`Error consultando usuarios: ${error.message}`);
    }
    
    console.log(`📋 Total usuarios: ${data?.length || 0}`);
    if (data && data.length > 0) {
      data.forEach(u => {
        console.log(`👤 ${u.nombre} (${u.email}) - ${u.rol} - Tablet ${u.ntablet}`);
      });
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('💥 Error:', error);
    return { success: false, error: error.message };
  }
};

// Hacer las funciones disponibles globalmente para usar desde consola
if (typeof window !== 'undefined') {
  window.insertarUsuariosReales = insertarUsuariosReales;
  window.verificarUsuarios = verificarUsuarios;
  console.log('🔧 Funciones disponibles en consola: insertarUsuariosReales(), verificarUsuarios()');
}