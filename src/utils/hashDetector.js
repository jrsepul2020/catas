// Función para aplicar automáticamente la implementación correcta de verificación de contraseñas
import { supabase } from './supabaseClient';

export async function detectarYConfigurarHash() {
  try {
    // Obtener una muestra de usuarios para analizar
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('password_hash')
      .limit(3);

    if (error) throw error;
    if (!usuarios || usuarios.length === 0) {
      throw new Error('No se encontraron usuarios para analizar');
    }

    // Analizar el primer hash disponible
    const primerHash = usuarios.find(u => u.password_hash)?.password_hash;
    if (!primerHash) {
      throw new Error('No se encontraron hashes de contraseñas');
    }

    let tipoDetectado = detectarTipoHash(primerHash);
    let implementacion = generarImplementacion(tipoDetectado);

    return {
      tipo: tipoDetectado,
      implementacion,
      ejemploHash: primerHash.substring(0, 20) + '...',
      totalUsuarios: usuarios.length
    };

  } catch (error) {
    console.error('Error detectando tipo de hash:', error);
    return {
      tipo: 'error',
      error: error.message
    };
  }
}

function detectarTipoHash(hash) {
  if (!hash || typeof hash !== 'string') return 'invalido';

  // bcrypt
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return 'bcrypt';
  }
  
  // SHA-512 crypt
  if (hash.startsWith('$6$')) {
    return 'sha512_crypt';
  }
  
  // SHA-256 crypt
  if (hash.startsWith('$5$')) {
    return 'sha256_crypt';
  }
  
  // MD5 crypt
  if (hash.startsWith('$1$')) {
    return 'md5_crypt';
  }
  
  // MD5 simple
  if (hash.length === 32 && /^[a-f0-9]+$/i.test(hash)) {
    return 'md5';
  }
  
  // SHA-1
  if (hash.length === 40 && /^[a-f0-9]+$/i.test(hash)) {
    return 'sha1';
  }
  
  // SHA-256
  if (hash.length === 64 && /^[a-f0-9]+$/i.test(hash)) {
    return 'sha256';
  }
  
  // Texto plano (contraseña muy corta)
  if (hash.length < 20 && !/^\$/.test(hash)) {
    return 'texto_plano';
  }
  
  return 'personalizado';
}

function generarImplementacion(tipo) {
  const implementaciones = {
    bcrypt: `
// Verificación con bcrypt
async verifyPassword(plainPassword, hashedPassword) {
  try {
    const bcrypt = await import('bcrypt');
    return await bcrypt.default.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verificando con bcrypt:', error);
    return false;
  }
}`,

    sha512_crypt: `
// Verificación con PostgreSQL crypt() - SHA-512
async verifyPassword(plainPassword, hashedPassword) {
  const { data, error } = await supabase.rpc('verify_password', {
    input_password: plainPassword,
    stored_hash: hashedPassword
  });
  if (error) throw error;
  return data;
}`,

    sha256_crypt: `
// Verificación con PostgreSQL crypt() - SHA-256
async verifyPassword(plainPassword, hashedPassword) {
  const { data, error } = await supabase.rpc('verify_password', {
    input_password: plainPassword,
    stored_hash: hashedPassword
  });
  if (error) throw error;
  return data;
}`,

    md5_crypt: `
// Verificación con PostgreSQL crypt() - MD5
async verifyPassword(plainPassword, hashedPassword) {
  const { data, error } = await supabase.rpc('verify_password', {
    input_password: plainPassword,
    stored_hash: hashedPassword
  });
  if (error) throw error;
  return data;
}`,

    md5: `
// Verificación MD5 simple (NO recomendado para producción)
async verifyPassword(plainPassword, hashedPassword) {
  const crypto = await import('crypto');
  const hash = crypto.createHash('md5').update(plainPassword).digest('hex');
  return hash.toLowerCase() === hashedPassword.toLowerCase();
}`,

    sha1: `
// Verificación SHA-1 (NO recomendado para producción)
async verifyPassword(plainPassword, hashedPassword) {
  const crypto = await import('crypto');
  const hash = crypto.createHash('sha1').update(plainPassword).digest('hex');
  return hash.toLowerCase() === hashedPassword.toLowerCase();
}`,

    sha256: `
// Verificación SHA-256
async verifyPassword(plainPassword, hashedPassword) {
  const crypto = await import('crypto');
  const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
  return hash.toLowerCase() === hashedPassword.toLowerCase();
}`,

    texto_plano: `
// Verificación texto plano (SOLO PARA DESARROLLO)
async verifyPassword(plainPassword, hashedPassword) {
  console.warn('⚠️ USANDO CONTRASEÑAS EN TEXTO PLANO - NO SEGURO');
  return plainPassword === hashedPassword;
}`
  };

  return implementaciones[tipo] || implementaciones.texto_plano;
}