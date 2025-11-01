import { useState } from 'react';
import PropTypes from 'prop-types';

export default function ClaveAcceso({ onSuccess }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave === '090909') {
      setError('');
      onSuccess();
    } else {
      setError('Clave incorrecta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fef5f5] to-[#fff]">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-[#390A0B] text-center">Acceso restringido</h1>
        <p className="mb-6 text-gray-600 text-center">Ingresa la clave de acceso para continuar</p>
        <input
          type="password"
          value={clave}
          onChange={e => setClave(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#390A0B] focus:border-transparent mb-4 text-lg text-center"
          placeholder="Clave de acceso"
          autoFocus
        />
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-[#390A0B] text-white rounded-lg font-bold text-lg hover:opacity-90 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

ClaveAcceso.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
