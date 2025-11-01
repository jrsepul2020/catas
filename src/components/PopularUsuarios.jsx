import React, { useState } from 'react';
import { supabase } from '../api/base44Client';

const PopularUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Usuarios que vamos a insertar en Supabase
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

  const insertarUsuarios = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🚀 Iniciando inserción de usuarios...');
      
      // Primero verificamos si ya existen usuarios
      const { data: existingUsers, error: checkError } = await supabase
        .from('usuarios')
        .select('*');
        
      if (checkError) {
        throw new Error(`Error verificando usuarios existentes: ${checkError.message}`);
      }
      
      console.log(`📊 Usuarios existentes: ${existingUsers?.length || 0}`);
      
      if (existingUsers && existingUsers.length > 0) {
        setResult(`⚠️ Ya existen ${existingUsers.length} usuarios en la tabla. No se insertarán duplicados.`);
        setLoading(false);
        return;
      }
      
      // Insertar usuarios uno por uno para mejor control
      const resultados = [];
      
      for (const usuario of usuariosParaInsertar) {
        console.log(`➕ Insertando usuario: ${usuario.nombre}`);
        
        const { data, error } = await supabase
          .from('usuarios')
          .insert([usuario])
          .select();
          
        if (error) {
          console.error(`❌ Error insertando ${usuario.nombre}:`, error);
          resultados.push(`❌ ${usuario.nombre}: ${error.message}`);
        } else {
          console.log(`✅ Usuario ${usuario.nombre} insertado correctamente`);
          resultados.push(`✅ ${usuario.nombre}: Insertado correctamente`);
        }
      }
      
      setResult(`🎉 Proceso completado:\n\n${resultados.join('\n')}`);
      
    } catch (error) {
      console.error('💥 Error en el proceso:', error);
      setResult(`💥 Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verificarUsuarios = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('id');
        
      if (error) {
        throw new Error(`Error consultando usuarios: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        setResult('📭 No hay usuarios en la tabla');
      } else {
        const listaUsuarios = data.map(u => 
          `👤 ${u.nombre} (${u.email}) - ${u.rol} - Tablet ${u.ntablet}`
        ).join('\n');
        
        setResult(`📋 Usuarios en la tabla (${data.length}):\n\n${listaUsuarios}`);
      }
      
    } catch (error) {
      console.error('💥 Error verificando:', error);
      setResult(`💥 Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🗃️ Gestión de Usuarios Supabase
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={verificarUsuarios}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '⏳ Verificando...' : '🔍 Verificar Usuarios'}
          </button>
          
          <button
            onClick={insertarUsuarios}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '⏳ Insertando...' : '➕ Insertar Usuarios'}
          </button>
        </div>
        
        {result && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Resultado:</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📝 Usuarios que se insertarán:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            {usuariosParaInsertar.map((u, i) => (
              <div key={i}>
                👤 <strong>{u.nombre}</strong> ({u.email}) - {u.rol} - Tablet {u.ntablet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularUsuarios;