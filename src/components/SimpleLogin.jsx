import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextSimple';

const SimpleLogin = () => {
  const { usuarios, quickLogin, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('🔄 SimpleLogin render:', { 
    usuarios: usuarios.length, 
    loading, 
    usuariosData: usuarios.slice(0, 2) // Mostrar solo los primeros 2 para debug
  });

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.tablet && usuario.tablet.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.ntablet && usuario.ntablet.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('🔍 Usuarios filtrados:', usuariosFiltrados.length);

  const handleQuickLogin = (usuario) => {
    quickLogin(usuario);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px' }}>Cargando Vinisima...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '48px', 
            margin: '0 0 10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🍷 Vinisima
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '18px',
            margin: '0 0 5px'
          }}>
            Selecciona tu perfil para acceder
          </p>
          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '14px',
            margin: '0'
          }}>
            {usuarios.length > 0 ? `${usuarios.length} usuarios cargados desde Supabase` : 'Cargando usuarios...'}
          </p>
        </div>

        {/* Buscador */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Buscar catador o tablet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Grid de usuarios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              onClick={() => handleQuickLogin(usuario)}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
                e.target.style.borderColor = usuario.rol === 'administrador' ? '#ff6b6b' : '#4ecdc4';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                e.target.style.borderColor = 'transparent';
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: usuario.rol === 'administrador' ? '#ff6b6b' : '#4ecdc4',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {usuario.rol === 'administrador' ? '👑' : '👨‍🍳'}
                </div>
                
                <h3 style={{
                  margin: '0 0 8px',
                  fontSize: '20px',
                  color: '#333',
                  fontWeight: 'bold'
                }}>
                  {usuario.nombre}
                </h3>
                
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: usuario.rol === 'administrador' ? '#ff6b6b' : '#4ecdc4',
                  marginBottom: '10px'
                }}>
                  {usuario.rol.toUpperCase()}
                </div>
                
                <p style={{
                  margin: '0',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  📱 {usuario.tablet || usuario.ntablet}
                </p>
              </div>
            </div>
          ))}
        </div>

        {usuariosFiltrados.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '18px',
            marginTop: '40px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            {usuarios.length === 0 ? (
              <div>
                <h3>⚠️ No se cargaron usuarios</h3>
                <p>Usuarios totales: {usuarios.length}</p>
                <p>Verifica la conexión con Supabase en el panel superior derecho</p>
              </div>
            ) : (
              <p>No se encontraron usuarios con esos términos de búsqueda</p>
            )}
          </div>
        )}

        {/* Debug info */}
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          <strong>Debug:</strong><br/>
          Total usuarios: {usuarios.length}<br/>
          Filtrados: {usuariosFiltrados.length}<br/>
          Loading: {loading.toString()}<br/>
          Búsqueda: {searchTerm}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleLogin;