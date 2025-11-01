import { AuthProvider, useAuth } from './contexts/AuthSimple';
import CleanLogin from './components/CleanLogin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LayoutNew from './pages/LayoutNew.jsx';
import Dashboard from './pages/Dashboard';
import Tandas from './pages/Tandas';
import Estadisticas from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';
import NuevaCata from './pages/NuevaCata';
import CataEspirituosos from './pages/CataEspirituosos';
import Muestras from './pages/Muestras';
import GestionTandas from './pages/GestionTandas';
import Mesas from './pages/Mesas';
import Catadores from './pages/Catadores';
// Import para hacer funciones disponibles globalmente
import './utils/poblarUsuarios.js';

// Crear el query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente interno que usa el contexto de auth
const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('🔄 AppContent render:', { user: user?.nombre || 'no user', loading });

  // Pantalla de carga
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
          <p style={{ fontSize: '18px' }}>Cargando VIRTUS...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <CleanLogin />;
  }

  // Si hay usuario, mostrar aplicación completa con routing
  console.log('✅ Usuario autenticado, mostrando dashboard:', user);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LayoutNew>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tandas" element={<Tandas />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/nuevacata" element={<NuevaCata />} />
            <Route path="/cataespirituosos" element={<CataEspirituosos />} />
            <Route path="/muestras" element={<Muestras />} />
            <Route path="/gestiontandas" element={<GestionTandas />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/catadores" element={<Catadores />} />
          </Routes>
        </LayoutNew>
      </Router>
    </QueryClientProvider>
  );
};

function App() {
  console.log('🟡 App iniciando con autenticación...');
  
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        {/* <SupabaseDebug /> */}
        
        {/* CSS Animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AuthProvider>
  )
}

export default App 