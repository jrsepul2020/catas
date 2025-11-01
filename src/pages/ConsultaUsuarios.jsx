import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../api/supabaseClient';

const ConsultaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detectHashType = (hash) => {
    if (!hash) return 'sin_hash';
    
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) return 'bcrypt';
    if (hash.startsWith('$6$')) return 'sha512_crypt';
    if (hash.startsWith('$5$')) return 'sha256_crypt';
    if (hash.startsWith('$1$')) return 'md5_crypt';
    if (hash.length === 32 && /^[a-f0-9]+$/i.test(hash)) return 'md5';
    if (hash.length === 40 && /^[a-f0-9]+$/i.test(hash)) return 'sha1';
    if (hash.length === 64 && /^[a-f0-9]+$/i.test(hash)) return 'sha256';
    if (hash.length < 20) return 'texto_plano';
    return 'personalizado';
  };

  const getHashColor = (type) => {
    const colors = {
      'bcrypt': 'bg-green-100 text-green-800',
      'sha512_crypt': 'bg-blue-100 text-blue-800',
      'sha256_crypt': 'bg-blue-100 text-blue-800',
      'md5_crypt': 'bg-yellow-100 text-yellow-800',
      'md5': 'bg-orange-100 text-orange-800',
      'sha1': 'bg-orange-100 text-orange-800',
      'sha256': 'bg-yellow-100 text-yellow-800',
      'texto_plano': 'bg-red-100 text-red-800',
      'personalizado': 'bg-gray-100 text-gray-800',
      'sin_hash': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const consultarUsuarios = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Consultando usuarios...');
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .limit(10);

      if (error) {
        throw error;
      }

      console.log('✅ Usuarios encontrados:', data);
      setUsuarios(data || []);
    } catch (err) {
      console.error('❌ Error consultando usuarios:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    consultarUsuarios();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>👥 Usuarios en la Base de Datos</CardTitle>
          <CardDescription>
            Consulta de usuarios disponibles para login con análisis de contraseñas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={consultarUsuarios} disabled={loading}>
              {loading ? '🔄 Consultando...' : '🔍 Refrescar'}
            </Button>
          </div>

          {error && (
            <Alert className="mb-4 border-red-500 bg-red-50">
              <AlertDescription>
                ❌ Error: {error}
              </AlertDescription>
            </Alert>
          )}

          {usuarios.length === 0 && !loading && !error && (
            <Alert>
              <AlertDescription>
                ℹ️ No se encontraron usuarios. Verifica que la tabla 'usuarios' exista y tenga datos.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {usuarios.map((usuario, index) => {
              const hashType = detectHashType(usuario.password_hash);
              return (
                <Card key={usuario.id || index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">ID</Badge>
                            <span className="font-mono text-sm">{usuario.id}</span>
                          </div>
                          {usuario.email && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Email</Badge>
                              <span className="break-all">{usuario.email}</span>
                            </div>
                          )}
                          {usuario.nombre && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Nombre</Badge>
                              <span>{usuario.nombre}</span>
                            </div>
                          )}
                          {usuario.username && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Usuario</Badge>
                              <span>{usuario.username}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getHashColor(hashType)}>
                              🔐 {hashType.toUpperCase()}
                            </Badge>
                          </div>
                          {usuario.password_hash && (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600">Hash (primeros 40 chars):</div>
                              <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                                {usuario.password_hash.substring(0, 40)}
                                {usuario.password_hash.length > 40 && '...'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Longitud: {usuario.password_hash.length} caracteres
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {usuarios.length > 0 && (
            <Card className="mt-6 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">📋 Resumen de Tipos de Hash</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(
                    usuarios.reduce((acc, u) => {
                      const type = detectHashType(u.password_hash);
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <Badge className={getHashColor(type)}>
                        {type}
                      </Badge>
                      <span>({count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaUsuarios;