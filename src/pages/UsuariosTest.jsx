import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UsuariosTest() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');
      
      if (error) {
        setError(`Error: ${error.message}`);
      } else {
        setUsuarios(data || []);
      }
    } catch (err) {
      setError(`Error de conexión: ${err.message}`);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👥 Tabla Usuarios
          </h1>
          <p className="text-gray-600">
            Revisión de la estructura de la tabla usuarios personalizada
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usuarios en la Base de Datos</CardTitle>
            <Button onClick={fetchUsuarios} disabled={loading}>
              {loading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {usuarios.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Total usuarios:</strong> {usuarios.length}
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        {usuarios.length > 0 && Object.keys(usuarios[0]).map(key => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.entries(usuario).map(([key, value], cellIdx) => (
                            <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                              {key === 'password_hash' ? (
                                <span className="text-gray-400 text-sm">
                                  {value ? `***${value.slice(-4)}` : 'Sin hash'}
                                </span>
                              ) : (
                                <span className="text-sm">
                                  {value !== null && value !== undefined ? String(value) : 'NULL'}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Información detectada:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Campos disponibles:</strong> {Object.keys(usuarios[0]).join(', ')}</li>
                    <li>• <strong>Campo email:</strong> {usuarios[0].email ? '✅ Encontrado' : '❌ No encontrado'}</li>
                    <li>• <strong>Campo password_hash:</strong> {usuarios[0].password_hash ? '✅ Encontrado' : '❌ No encontrado'}</li>
                  </ul>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Cargando usuarios...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron usuarios o la tabla no existe.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {usuarios.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">✅ Próximos pasos</CardTitle>
            </CardHeader>
            <CardContent className="text-green-700">
              <p className="mb-3">
                Perfecto, tienes una tabla usuarios con {usuarios.length} usuarios. 
                Ahora podemos adaptar el sistema de autenticación para usar esta tabla.
              </p>
              <p>
                <strong>¿Cómo están hasheadas las contraseñas?</strong> Necesito saber si usas:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>bcrypt</li>
                <li>Supabase auth.crypt()</li>
                <li>MD5/SHA</li>
                <li>Otro método</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}