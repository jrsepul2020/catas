import './App.css'

// Componente super simple para debuggear
const SimpleApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🍷 Vinisima - Test Simple</h1>
      <p>Si ves esto, React está funcionando.</p>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>Variables de entorno:</h3>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'NO DEFINIDA'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NO DEFINIDA'}</p>
      </div>
      <button onClick={() => alert('React funciona!')}>Test Click</button>
    </div>
  );
};

function App() {
  console.log('🟡 App renderizando...');
  console.log('🟡 VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('🟡 VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTE' : 'NO EXISTE');
  
  return <SimpleApp />;
}

export default App