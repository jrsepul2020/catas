import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const SupabaseTest = () => {
  const [status, setStatus] = useState('conectando...');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔄 Probando conexión con Supabase...');
        
        // Test de conexión básica
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, email, nombre, rol, ntablet')
          .limit(10);
        
        if (error) {
          console.error('❌ Error al conectar:', error);
          setError(error.message);
          setStatus('error');
        } else {
          console.log('✅ Conexión exitosa. Usuarios:', data);
          setUsuarios(data);
          setStatus('conectado');
        }
      } catch (err) {
        console.error('❌ Error de red:', err);
        setError(err.message);
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: `2px solid ${status === 'conectado' ? '#4ecdc4' : status === 'error' ? '#ff6b6b' : '#ffd93d'}`,
      maxWidth: '300px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>
        🔗 Estado Supabase
      </h4>
      
      <p style={{ margin: '5px 0' }}>
        <strong>Estado:</strong> {status}
      </p>
      
      {error && (
        <p style={{ margin: '5px 0', color: '#ff6b6b' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      
      {usuarios.length > 0 && (
        <div>
          <p style={{ margin: '10px 0 5px' }}>
            <strong>Usuarios encontrados:</strong> {usuarios.length}
          </p>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {usuarios.map(usuario => (
              <div key={usuario.id} style={{
                fontSize: '11px',
                padding: '3px 0',
                borderBottom: '1px solid #eee'
              }}>
                <strong>{usuario.nombre}</strong> ({usuario.rol})<br/>
                📱 {usuario.ntablet}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;