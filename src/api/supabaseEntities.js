import { supabase } from './supabaseClient';

// Entidad Muestra
export const Muestra = {
  async list(orderBy = 'created_at') {
    const { data, error } = await supabase
      .from('muestras')
      .select('*')
      .order(orderBy.replace('-', ''), { ascending: !orderBy.startsWith('-') });
    
    if (error) throw error;
    return data || [];
  },

  async create(data) {
    // Obtener el usuario actual del sistema personalizado
    const { UsuarioCustom } = await import('./usuarioCustom');
    const user = await UsuarioCustom.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const { data: result, error } = await supabase
      .from('muestras')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('muestras')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async delete(id) {
    const { error } = await supabase
      .from('muestras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async get(id) {
    const { data, error } = await supabase
      .from('muestras')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Entidad Tanda
export const Tanda = {
  async list(orderBy = 'created_at') {
    const { data, error } = await supabase
      .from('tandas')
      .select('*')
      .order(orderBy.replace('-', ''), { ascending: !orderBy.startsWith('-') });
    
    if (error) throw error;
    return data || [];
  },

  async create(data) {
    // Obtener el usuario actual del sistema personalizado
    const { UsuarioCustom } = await import('./usuarioCustom');
    const user = await UsuarioCustom.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const { data: result, error } = await supabase
      .from('tandas')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('tandas')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async delete(id) {
    const { error } = await supabase
      .from('tandas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async get(id) {
    const { data, error } = await supabase
      .from('tandas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Entidad Cata
export const Cata = {
  async list(orderBy = 'created_at') {
    const { data, error } = await supabase
      .from('catas')
      .select('*')
      .order(orderBy.replace('-', ''), { ascending: !orderBy.startsWith('-') });
    
    if (error) throw error;
    return data || [];
  },

  async create(data) {
    // Obtener el usuario actual del sistema personalizado
    const { UsuarioCustom } = await import('./usuarioCustom');
    const user = await UsuarioCustom.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const { data: result, error } = await supabase
      .from('catas')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('catas')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async delete(id) {
    const { error } = await supabase
      .from('catas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async get(id) {
    const { data, error } = await supabase
      .from('catas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Entidad CataEspirituoso
export const CataEspirituoso = {
  async list(orderBy = 'created_at') {
    const { data, error } = await supabase
      .from('catas_espirituosos')
      .select('*')
      .order(orderBy.replace('-', ''), { ascending: !orderBy.startsWith('-') });
    
    if (error) throw error;
    return data || [];
  },

  async create(data) {
    // Obtener el usuario actual del sistema personalizado
    const { UsuarioCustom } = await import('./usuarioCustom');
    const user = await UsuarioCustom.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const { data: result, error } = await supabase
      .from('catas_espirituosos')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('catas_espirituosos')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async delete(id) {
    const { error } = await supabase
      .from('catas_espirituosos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async get(id) {
    const { data, error } = await supabase
      .from('catas_espirituosos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Autenticación
export const User = {
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};