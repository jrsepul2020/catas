import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const SupabaseDebug = () => {
  const [status, setStatus] = useState('🔄 Probando...');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const testSupabase = async () => {
      const log = [];
      
      try {
        // Test 1: Verificar configuración
        log.push('✅ Cliente Supabase inicializado');
        log.push(`🔗 URL: ${import.meta.env.VITE_SUPABASE_URL}`);
        log.push(`🔑 Key exists: ${!!import.meta.env.VITE_SUPABASE_ANON_KEY}`);
        
        // Test 2: Verificar conexión básica
        log.push('🔄 Probando conexión...');
        const { data: tables, error: tablesError } = await supabase
          .from('usuarios')
          .select('count', { count: 'exact', head: true });
        
        if (tablesError) {
          log.push(`❌ Error accediendo tabla usuarios: ${tablesError.message}`);
          setStatus('❌ Error de conexión');
        } else {
          log.push('✅ Tabla usuarios accesible');
          
          // Test 3: Obtener datos
          const { data, error, count } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact' });
          
          if (error) {
            log.push(`❌ Error obteniendo datos: ${error.message}`);
            setStatus('❌ Error obteniendo datos');
          } else {
            log.push(`✅ Datos obtenidos exitosamente`);
            log.push(`📊 Total registros: ${count}`);
            log.push(`📋 Registros retornados: ${data?.length || 0}`);
            
            if (data && data.length > 0) {
              log.push(`🔍 Primer registro:`, JSON.stringify(data[0], null, 2));
            }
            
            setStatus('✅ Conexión exitosa');
          }
        }
      } catch (error) {
        log.push(`❌ Error crítico: ${error.message}`);
        setStatus('❌ Error crítico');
      }
      
      setDetails(log);
    };

    testSupabase();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      maxWidth: '500px',
      maxHeight: '70vh',
      overflow: 'auto',
      zIndex: 2000,
      fontSize: '14px'
    }}>
      <h3 style={{ margin: '0 0 15px', color: '#333' }}>
        🔧 Diagnóstico Supabase
      </h3>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        marginBottom: '15px',
        fontWeight: 'bold'
      }}>
        {status}
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap'
      }}>
        {details.map((detail, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupabaseDebug;