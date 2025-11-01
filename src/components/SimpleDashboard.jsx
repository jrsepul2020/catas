import { useAuth } from '../contexts/AuthContextSimple';

const Dashboard = () => {
  const { user, signOut, userName, userRole, userTablet, isAdmin } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{
              margin: '0',
              fontSize: '28px',
              color: '#333'
            }}>
              🍷 Vinisima
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {userName}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666'
              }}>
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
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff3838';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff4757';
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            margin: '0 0 20px',
            color: '#333'
          }}>
            ¡Bienvenido, {userName}! 🎉
          </h2>
          
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: isAdmin ? '#ff6b6b' : '#4ecdc4',
            marginBottom: '30px'
          }}>
            {userRole.toUpperCase()}
          </div>
          
          <div style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px'
          }}>
            <p style={{ margin: '5px 0' }}>
              📧 <strong>Email:</strong> {user?.email || 'No disponible'}
            </p>
            <p style={{ margin: '5px 0' }}>
              📱 <strong>Tablet:</strong> {userTablet}
            </p>
            {user?.id && (
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#999' }}>
                🆔 ID: {user.id}
              </p>
            )}
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              fontSize: '24px',
              margin: '0 0 15px',
              color: '#333'
            }}>
              Sistema funcionando correctamente ✅
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0'
            }}>
              React, autenticación y estilos cargados exitosamente.<br/>
              Ahora podemos integrar las funcionalidades específicas de Vinisima.
            </p>
          </div>
          
          {isAdmin && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h4 style={{
                fontSize: '18px',
                margin: '0 0 10px',
                color: '#856404'
              }}>
                🔧 Panel de Administrador
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#856404',
                margin: '0'
              }}>
                Tienes permisos de administrador. Aquí se mostrarán las opciones de gestión.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;