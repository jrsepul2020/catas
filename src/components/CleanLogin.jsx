import { useState } from 'react';
import { useAuth } from '../contexts/AuthSimple';

const CleanLogin = () => {
  const { usuarios, quickLogin, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.ntablet && usuario.ntablet.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#667eea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🍷 Vinisima</h2>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#667eea',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '48px', margin: '0 0 10px' }}>
            🍷 Vinisima
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
            Selecciona tu perfil ({usuarios.length} usuarios)
          </p>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre o tablet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '10px',
            marginBottom: '30px',
            boxSizing: 'border-box'
          }}
        />

        {/* Lista de usuarios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              onClick={() => quickLogin(usuario)}
              style={{
                backgroundColor: 'white',
                padding: '14px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: '#333', fontWeight: '600', fontSize: '15px' }}>
                  {usuario.nombre}
                </span>
                <span style={{
                  backgroundColor: usuario.rol === 'administrador' ? '#ff6b6b' : '#4ecdc4',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '14px',
                  fontSize: '11px'
                }}>
                  {usuario.rol.toUpperCase()}
                </span>
                <span style={{ color: '#666', fontSize: '12px' }}>
                  Tablet {usuario.ntablet}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sin resultados */}
        {usuariosFiltrados.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            marginTop: '40px',
            backgroundColor: 'rgba(255,0,0,0.2)',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <h3>⚠️ No se encontraron usuarios</h3>
            <p><strong>Total disponibles:</strong> {usuarios.length}</p>
            <p><strong>Término búsqueda:</strong> {searchTerm}</p>
            
            {usuarios.length === 0 && (
              <div style={{ marginTop: '20px', fontSize: '14px' }}>
                <p>🔍 <strong>Posibles causas:</strong></p>
                <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                  <li>Error de conexión con Supabase</li>
                  <li>Tabla usuarios vacía</li>
                  <li>Problemas de permisos en la tabla</li>
                  <li>Campo ntablet no existe</li>
                </ul>
                <p style={{ marginTop: '15px' }}>
                  <strong>👉 Revisa la consola del navegador (F12) para más detalles</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Debug info - temporal */}
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000,
          maxWidth: '250px'
        }}>
          <strong>🔧 Debug Info:</strong><br/>
          Loading: {loading.toString()}<br/>
          Usuarios totales: {usuarios.length}<br/>
          Usuarios filtrados: {usuariosFiltrados.length}<br/>
          Búsqueda: {searchTerm || '(vacío)'}<br/>
          {usuarios.length > 0 && (
            <>Primer usuario: {usuarios[0]?.nombre || 'N/A'}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanLogin;