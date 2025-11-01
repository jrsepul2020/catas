import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Sample {
  id: string;
  codigo: number;
  codigotexto?: string;
  nombre: string;
  empresa?: string;
  categoria?: string;
  origen?: string;
  igp?: string;
  pais?: string;
  azucar?: number;
  grado?: number;
  existencias?: number;
  año?: number;
  tipouva?: string;
  tipoaceituna?: string;
  destilado?: string;
  fecha?: string;
  manual?: boolean;
  categoriaoiv?: string;
  categoriadecata?: string;
  tanda?: number;
}
