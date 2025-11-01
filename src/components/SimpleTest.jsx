import { useState } from 'react';

const SimpleTest = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      margin: '20px',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>🧪 Test de React</h2>
      <p>Si puedes ver esto, React está funcionando!</p>
      <p>Contador: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Incrementar
      </button>
    </div>
  );
};

export default SimpleTest;