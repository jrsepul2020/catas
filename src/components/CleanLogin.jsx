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
        background: 'linear-gradient(135deg, #390A0B 0%, #5a1616 50%, #7a1c1c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>🍷 VIRTUS</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Cargando catadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #390A0B 0%, #5a1616 50%, #7a1c1c 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '52px', 
            margin: '0 0 10px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
          }}>
            🍷 VIRTUS
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '20px',
            fontWeight: '300'
          }}>
            Selecciona tu perfil de catador ({usuarios.length} catadores)
          </p>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar catador por nombre o tablet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '16px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            marginBottom: '30px',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            outline: 'none',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        />

        {/* Lista de usuarios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              onClick={() => quickLogin(usuario)}
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s',
                border: '2px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #390A0B 0%, #7a1c1c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  boxShadow: '0 4px 8px rgba(57,10,11,0.3)',
                  border: '3px solid rgba(255,255,255,0.9)'
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '24px', 
                    fontWeight: 'bold' 
                  }}>
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Nombre */}
                <span style={{ 
                  color: '#390A0B', 
                  fontWeight: '700', 
                  fontSize: '16px',
                  display: 'block',
                  width: '100%'
                }}>
                  {usuario.nombre}
                </span>
                
                {/* Badge de rol */}
                <span style={{
                  background: usuario.rol === 'administrador' 
                    ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' 
                    : 'linear-gradient(135deg, #390A0B 0%, #5a1616 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {usuario.rol === 'administrador' ? '👑 Admin' : 'Catador'}
                </span>
                
                {/* Número de tablet */}
                <span style={{ 
                  color: '#666', 
                  fontSize: '13px',
                  backgroundColor: 'rgba(57,10,11,0.08)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  📱 Tablet {usuario.ntablet}
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
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>⚠️ No se encontraron catadores</h3>
            <p style={{ fontSize: '16px' }}><strong>Total disponibles:</strong> {usuarios.length}</p>
            <p style={{ fontSize: '16px' }}><strong>Término búsqueda:</strong> {searchTerm}</p>
            
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