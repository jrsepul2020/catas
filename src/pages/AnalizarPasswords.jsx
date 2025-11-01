import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AnalizarPasswords() {
  const [usuarios, setUsuarios] = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .limit(5); // Solo los primeros 5 para análisis
      
      if (error) {
        setError(`Error: ${error.message}`);
      } else {
        setUsuarios(data || []);
        analizarPasswords(data || []);
      }
    } catch (err) {
      setError(`Error de conexión: ${err.message}`);
    }
    
    setLoading(false);
  };

  const analizarPasswords = (usuariosData) => {
    if (!usuariosData || usuariosData.length === 0) {
      setAnalisis({ tipo: 'sin_datos', descripcion: 'No hay usuarios para analizar' });
      return;
    }

    // Obtener algunos hashes para analizar
    const hashes = usuariosData
      .map(u => u.password_hash)
      .filter(h => h && h.length > 0)
      .slice(0, 3);

    if (hashes.length === 0) {
      setAnalisis({ tipo: 'sin_hashes', descripcion: 'No se encontraron hashes de contraseñas' });
      return;
    }

    const primerHash = hashes[0];
    let tipoDetectado = 'desconocido';
    let descripcion = '';
    let implementacion = '';

    // Analizar patrones comunes de hash
    if (primerHash.startsWith('$2a$') || primerHash.startsWith('$2b$') || primerHash.startsWith('$2y$')) {
      tipoDetectado = 'bcrypt';
      descripcion = 'Hashes bcrypt detectados - Muy seguro ✅';
      implementacion = 'bcrypt';
    } 
    else if (primerHash.startsWith('$6$')) {
      tipoDetectado = 'sha512_crypt';
      descripcion = 'Hashes SHA-512 crypt detectados - Seguro ✅';
      implementacion = 'crypt';
    }
    else if (primerHash.startsWith('$5$')) {
      tipoDetectado = 'sha256_crypt';
      descripcion = 'Hashes SHA-256 crypt detectados - Seguro ✅';
      implementacion = 'crypt';
    }
    else if (primerHash.startsWith('$1$')) {
      tipoDetectado = 'md5_crypt';
      descripcion = 'Hashes MD5 crypt detectados - Menos seguro ⚠️';
      implementacion = 'crypt';
    }
    else if (primerHash.length === 32 && /^[a-f0-9]+$/i.test(primerHash)) {
      tipoDetectado = 'md5';
      descripcion = 'Hashes MD5 simples detectados - INSEGURO ❌';
      implementacion = 'md5';
    }
    else if (primerHash.length === 40 && /^[a-f0-9]+$/i.test(primerHash)) {
      tipoDetectado = 'sha1';
      descripcion = 'Hashes SHA-1 detectados - INSEGURO ❌';
      implementacion = 'sha1';
    }
    else if (primerHash.length === 64 && /^[a-f0-9]+$/i.test(primerHash)) {
      tipoDetectado = 'sha256';
      descripcion = 'Hashes SHA-256 simples detectados - Poco seguro ⚠️';
      implementacion = 'sha256';
    }
    else if (primerHash.length < 20) {
      tipoDetectado = 'texto_plano';
      descripcion = 'Contraseñas en texto plano - MUY INSEGURO ❌❌';
      implementacion = 'texto_plano';
    }
    else {
      tipoDetectado = 'personalizado';
      descripcion = 'Formato personalizado o desconocido';
      implementacion = 'personalizado';
    }

    setAnalisis({
      tipo: tipoDetectado,
      descripcion,
      implementacion,
      longitud: primerHash.length,
      ejemplos: hashes.map(h => ({ 
        hash: h.substring(0, 20) + '...', 
        longitud: h.length 
      })),
      patron: detectarPatron(hashes)
    });
  };

  const detectarPatron = (hashes) => {
    const longitudes = hashes.map(h => h.length);
    const longitudUnica = [...new Set(longitudes)];
    
    if (longitudUnica.length === 1) {
      return `Longitud consistente: ${longitudUnica[0]} caracteres`;
    } else {
      return `Longitudes variables: ${longitudUnica.join(', ')} caracteres`;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const implementarSolucion = () => {
    if (!analisis) return null;

    const soluciones = {
      bcrypt: {
        titulo: 'Implementación bcrypt',
        codigo: `// Instalar: npm install bcrypt
import bcrypt from 'bcrypt';

async verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}`
      },
      crypt: {
        titulo: 'Implementación PostgreSQL crypt()',
        codigo: `// Crear función en Supabase SQL Editor:
CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

// En JavaScript:
async verifyPassword(plainPassword, hashedPassword) {
  const { data, error } = await supabase.rpc('verify_password', {
    input_password: plainPassword,
    stored_hash: hashedPassword
  });
  if (error) throw error;
  return data;
}`
      },
      md5: {
        titulo: '⚠️ Implementación MD5 (No recomendado)',
        codigo: `// Usar crypto nativo de Node.js
import crypto from 'crypto';

async verifyPassword(plainPassword, hashedPassword) {
  const hash = crypto.createHash('md5').update(plainPassword).digest('hex');
  return hash === hashedPassword;
}`
      },
      sha1: {
        titulo: '⚠️ Implementación SHA-1 (No recomendado)',
        codigo: `import crypto from 'crypto';

async verifyPassword(plainPassword, hashedPassword) {
  const hash = crypto.createHash('sha1').update(plainPassword).digest('hex');
  return hash === hashedPassword;
}`
      },
      sha256: {
        titulo: 'Implementación SHA-256',
        codigo: `import crypto from 'crypto';

async verifyPassword(plainPassword, hashedPassword) {
  const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
  return hash === hashedPassword;
}`
      },
      texto_plano: {
        titulo: '❌ Texto Plano (MUY INSEGURO)',
        codigo: `// SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
async verifyPassword(plainPassword, hashedPassword) {
  return plainPassword === hashedPassword;
}`
      }
    };

    return soluciones[analisis.implementacion] || null;
  };

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Análisis de Contraseñas
          </h1>
          <p className="text-gray-600">
            Detectando automáticamente el tipo de hash usado en tu tabla usuarios
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Análisis Automático</CardTitle>
            <Button onClick={fetchUsuarios} disabled={loading}>
              {loading ? 'Analizando...' : 'Reanalizar'}
            </Button>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {analisis && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2">Resultado del Análisis</h3>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <strong>Tipo detectado:</strong> {analisis.tipo}
                    </div>
                    <div>
                      <strong>Longitud:</strong> {analisis.longitud} caracteres
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <strong>Evaluación:</strong> {analisis.descripcion}
                  </div>
                  
                  <div className="mt-3">
                    <strong>Patrón:</strong> {analisis.patron}
                  </div>

                  {analisis.ejemplos && (
                    <div className="mt-3">
                      <strong>Ejemplos (primeros 20 chars):</strong>
                      <div className="mt-1 font-mono text-sm bg-white p-2 rounded border">
                        {analisis.ejemplos.map((ej, idx) => (
                          <div key={idx}>{ej.hash} (longitud: {ej.longitud})</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {implementarSolucion() && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800">
                        💡 {implementarSolucion().titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                        {implementarSolucion().codigo}
                      </pre>
                      
                      <div className="mt-4">
                        <Button 
                          onClick={() => aplicarImplementacion(analisis.implementacion)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Aplicar esta implementación automáticamente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {usuarios.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Usuarios analizados:</h4>
                <div className="text-sm space-y-1">
                  {usuarios.map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span>{user.email}</span>
                      <span className="text-gray-500 font-mono text-xs">
                        {user.password_hash ? `${user.password_hash.substring(0, 15)}...` : 'Sin hash'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  async function aplicarImplementacion(tipo) {
    // Esta función aplicará automáticamente la implementación correcta
    alert(`Aplicando implementación para ${tipo}...`);
    // Aquí implementaremos la actualización automática del código
  }
}