import { useAuth } from '../contexts/AuthSimple';

const CleanLogin = () => {
  const { usuarios, quickLogin, loading } = useAuth();

  // Ordenar usuarios por número de tablet
  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const tabletA = parseInt(a.ntablet) || 0;
    const tabletB = parseInt(b.ntablet) || 0;
    return tabletA - tabletB;
  });

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
  <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '48px', 
            margin: '0 0 8px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
          }}>
            🍷 VIRTUS
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '18px',
            fontWeight: '300',
            margin: '0'
          }}>
            Selecciona tu perfil de catador ({usuarios.length} catadores)
          </p>
        </div>

        {/* Lista de usuarios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px'
        }}>
          {usuariosOrdenados.map((usuario) => (
            <div
              key={usuario.id}
              onClick={() => quickLogin(usuario)}
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
                padding: '15px',
                borderRadius: '10px',
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
                gap: '6px',
                alignItems: 'center'
              }}>
                
                {/* Nombre */}
                <span style={{ 
                  color: '#390A0B', 
                  fontWeight: '700', 
                  fontSize: '13px',
                  display: 'block',
                  width: '100%'
                }}>
                  {usuario.nombre}
                </span>
                
                {/* Badge de rol */}
                <span style={{
                  background: usuario.rol === 'administrador' 
                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                    : usuario.rol === 'presidente'
                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
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
                  {usuario.rol === 'administrador' ? '👑 Admin' : usuario.rol}
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
        {usuarios.length === 0 && !loading && (
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
      </div>
    </div>
  );
};

export default CleanLogin;