import { useAuth } from '../contexts/AuthSimple';

const CleanDashboard = () => {
  const { user, signOut, userName, userRole, userTablet, isAdmin } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: '0', color: '#333' }}>🍷 Vinisima</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#333' }}>{userName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {userRole} • {userTablet}
              </div>
            </div>
            
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? '#ff6b6b' : '#4ecdc4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {isAdmin ? '👑' : '👨‍🍳'}
            </div>
            
            <button
              onClick={signOut}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '32px', margin: '0 0 20px', color: '#333' }}>
            ¡Bienvenido, {userName}! 🎉
          </h2>
          
          <div style={{
            backgroundColor: isAdmin ? '#ff6b6b' : '#4ecdc4',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            display: 'inline-block',
            marginBottom: '30px'
          }}>
            {userRole.toUpperCase()}
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Información de la sesión
            </h3>
            <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
            <p><strong>Tablet:</strong> {userTablet}</p>
            <p><strong>ID:</strong> {user?.id}</p>
          </div>
          
          {isAdmin && (
            <div style={{ marginBottom: '20px', backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>� Gestión de Usuarios Supabase</h3>
              <div style={{ fontSize: '14px', color: '#34495e', lineHeight: '1.6' }}>
                <p><strong>📋 Método Directo (F12 → Consola):</strong></p>
                <p>1. <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '3px' }}>verificarUsuarios()</code> - Ver usuarios actuales</p>
                <p>2. <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '3px' }}>insertarUsuariosReales()</code> - Insertar 5 usuarios</p>
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#7f8c8d' }}>
                  💡 Abre DevTools (F12), ve a Console y ejecuta las funciones
                </p>
              </div>
            </div>
          )}
          
          <div style={{ color: '#28a745', fontSize: '18px' }}>
            ✅ Sistema funcionando correctamente
          </div>
        </div>
      </main>
    </div>
  );
};

export default CleanDashboard;