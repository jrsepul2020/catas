import { supabase } from './supabaseClient';

// Sistema de autenticación personalizado usando tabla usuarios
export const UsuarioCustom = {
  currentUser: null,
  authListeners: [],

  // Verificar credenciales contra la tabla usuarios
  async signIn(email, password) {
    try {
      // Obtener usuario de la tabla personalizada
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (error) throw error;
      if (!usuarios || usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const usuario = usuarios[0];

      // Aquí necesitamos verificar la contraseña según cómo esté hasheada
      // Por ahora, asumiremos que necesitas implementar la verificación
      const isPasswordValid = await this.verifyPassword(password, usuario.password_hash);
      
      if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
      }

      // Establecer usuario actual
      this.currentUser = {
        id: usuario.id,
        email: usuario.email,
        // Agregar otros campos de tu tabla usuarios
        ...usuario,
        // Eliminar el hash de la contraseña por seguridad
        password_hash: undefined
      };

      // Notificar a los listeners
      this.notifyAuthChange('SIGNED_IN', this.currentUser);

      return { 
        user: this.currentUser,
        session: { user: this.currentUser }
      };

    } catch (error) {
      throw error;
    }
  },

  // Verificar contraseña - Detección automática del tipo de hash
  async verifyPassword(plainPassword, hashedPassword) {
    if (!hashedPassword || !plainPassword) return false;

    try {
      // Detección automática del tipo de hash
      
      // bcrypt
      if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$')) {
        console.log('🔐 Detectado: bcrypt');
        console.warn('❌ bcrypt no está instalado');
        console.log('📋 Para instalar: npm install bcrypt');
        console.log('🔧 Mientras tanto, este login fallará');
        return false;
      }
      
      // PostgreSQL crypt variants
      if (hashedPassword.startsWith('$6$') || hashedPassword.startsWith('$5$') || hashedPassword.startsWith('$1$')) {
        console.log('🔐 Detectado: PostgreSQL crypt');
        try {
          const { data, error } = await supabase.rpc('verify_password', {
            input_password: plainPassword,
            stored_hash: hashedPassword
          });
          if (error) {
            if (error.code === '42883') {
              console.error('⚠️ Función verify_password no existe en Supabase');
              console.log('📋 Para crearla, ejecuta supabase-password-functions.sql en el SQL Editor de Supabase');
            } else {
              console.error('Error en función verify_password:', error);
            }
            return false;
          }
          return data === true;
        } catch (error) {
          console.error('Error verificando con crypt:', error);
          return false;
        }
      }
      
      // MD5 simple (32 chars hexadecimal)
      if (hashedPassword.length === 32 && /^[a-f0-9]+$/i.test(hashedPassword)) {
        console.log('🔐 Detectado: MD5 (no recomendado)');
        const crypto = await import('crypto');
        const hash = crypto.createHash('md5').update(plainPassword).digest('hex');
        return hash.toLowerCase() === hashedPassword.toLowerCase();
      }
      
      // SHA-1 (40 chars hexadecimal)
      if (hashedPassword.length === 40 && /^[a-f0-9]+$/i.test(hashedPassword)) {
        console.log('🔐 Detectado: SHA-1 (no recomendado)');
        const crypto = await import('crypto');
        const hash = crypto.createHash('sha1').update(plainPassword).digest('hex');
        return hash.toLowerCase() === hashedPassword.toLowerCase();
      }
      
      // SHA-256 (64 chars hexadecimal)
      if (hashedPassword.length === 64 && /^[a-f0-9]+$/i.test(hashedPassword)) {
        console.log('🔐 Detectado: SHA-256');
        const crypto = await import('crypto');
        const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
        return hash.toLowerCase() === hashedPassword.toLowerCase();
      }
      
      // Texto plano (para desarrollo)
      if (hashedPassword.length < 20 && !/^\$/.test(hashedPassword)) {
        console.warn('⚠️ DETECTADO: Texto plano - MUY INSEGURO');
        return plainPassword === hashedPassword;
      }
      
      // Fallback: intentar comparación directa
      console.warn('⚠️ Tipo de hash desconocido, intentando comparación directa');
      return plainPassword === hashedPassword;
      
    } catch (error) {
      console.error('Error en verificación de contraseña:', error);
      return false;
    }
  },

  async signOut() {
    this.currentUser = null;
    this.notifyAuthChange('SIGNED_OUT', null);
    return { success: true };
  },

  async getUser() {
    return this.currentUser;
  },

  // Simulación de auth state change para compatibilidad
  onAuthStateChange(callback) {
    this.authListeners.push(callback);
    
    // Llamar inmediatamente con el estado actual
    if (this.currentUser) {
      callback('SIGNED_IN', { user: this.currentUser });
    } else {
      callback('SIGNED_OUT', null);
    }

    // Retornar objeto similar a Supabase
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
              this.authListeners.splice(index, 1);
            }
          }
        }
      }
    };
  },

  notifyAuthChange(event, session) {
    this.authListeners.forEach(callback => {
      callback(event, session);
    });
  },

  // Obtener todos los usuarios (solo para admin)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, activo, created_at') // Sin password_hash por seguridad
      .order('email');
    
    if (error) throw error;
    return data || [];
  },

  // Crear usuario (registro - opcional)
  async signUp(email, password, metadata = {}) {
    // Verificar si el usuario ya existe
    const { data: existing } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) {
      throw new Error('El usuario ya existe');
    }

    // Hash de la contraseña (implementar según tu método)
    const hashedPassword = await this.hashPassword(password);

    // Insertar nuevo usuario
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        email,
        password_hash: hashedPassword,
        nombre: metadata.nombre || email.split('@')[0],
        activo: true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return { 
      user: {
        id: data.id,
        email: data.email,
        ...data,
        password_hash: undefined
      }
    };
  },

  // Hash de contraseña (implementar según tu método)
  async hashPassword(plainPassword) {
    // TEMPORAL: Sin hash (NO SEGURO - solo para testing)
    console.warn('⚠️ USANDO HASH INSEGURO - Implementa hash real');
    return plainPassword; // Solo para testing
    
    // Si usas bcrypt:
    // const bcrypt = require('bcrypt');
    // return await bcrypt.hash(plainPassword, 10);
    
    // Si usas crypt() de PostgreSQL:
    // const { data, error } = await supabase.rpc('hash_password', {
    //   input_password: plainPassword
    // });
    // return data;
  }
};