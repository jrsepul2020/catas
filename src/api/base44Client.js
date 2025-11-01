// Configuración de Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL o ANON KEY no configurados. Revisa tu archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Base44 cliente eliminado - Ahora usando Supabase
// Este archivo se mantiene para evitar errores de importación legacy

export const base44 = {
  auth: {
    me: () => Promise.reject(new Error('Base44 ha sido migrado a Supabase')),
    login: () => Promise.reject(new Error('Base44 ha sido migrado a Supabase')),
    logout: () => Promise.reject(new Error('Base44 ha sido migrado a Supabase')),
    updateMe: () => Promise.reject(new Error('Base44 ha sido migrado a Supabase'))
  },
  integrations: {
    Core: {}
  }
};
