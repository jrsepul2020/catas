import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { testDatabaseConnection } from '../api/vinisimaAPI';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔄 Probando conexión con Supabase Auth...');
        
        // Intentar obtener la sesión actual
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error de conexión Auth:', error);
          setConnectionStatus('error');
          setError(error.message);
        } else {
          console.log('✅ Conexión Auth exitosa');
          setConnectionStatus('success');
          
          // Ahora probar la base de datos
          console.log('� Probando conexión con base de datos...');
          const dbResult = await testDatabaseConnection();
          
          if (dbResult.success) {
            console.log('✅ Conexión BD exitosa');
            setDbStatus('success');
          } else {
            console.error('❌ Error de BD:', dbResult.error);
            setDbStatus('error');
            if (!error) setError(dbResult.error);
          }
        }
      } catch (err) {
        console.error('❌ Error inesperado:', err);
        setConnectionStatus('error');
        setDbStatus('error');
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Verificando conexión...';
      case 'success':
        return 'Conectado a Supabase';
      case 'error':
        return 'Error de conexión';
      default:
        return 'Estado desconocido';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDbStatusIcon = () => {
    switch (dbStatus) {
      case 'checking':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        {/* Estado de Auth */}
        <div className="flex items-center gap-3">
          <div className="text-xl">{getStatusIcon()}</div>
          <div>
            <div className={`font-medium ${getStatusColor()}`}>
              Auth: {getStatusText()}
            </div>
            {connectionStatus === 'success' && (
              <div className="text-xs text-gray-500">
                Autenticación funcional
              </div>
            )}
          </div>
        </div>
        
        {/* Estado de BD */}
        <div className="flex items-center gap-3">
          <div className="text-xl">{getDbStatusIcon()}</div>
          <div>
            <div className={`font-medium ${dbStatus === 'success' ? 'text-green-600' : dbStatus === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
              BD: {dbStatus === 'checking' ? 'Verificando...' : dbStatus === 'success' ? 'Conectada' : 'Error'}
            </div>
            {dbStatus === 'success' && (
              <div className="text-xs text-gray-500">
                Base de datos lista
              </div>
            )}
          </div>
        </div>
        
        {/* Error general */}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}
        
        {/* Estado general */}
        {connectionStatus === 'success' && dbStatus === 'success' && (
          <div className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
            🎉 Sistema Vinísima completamente funcional
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;