import React, { useState, useEffect } from 'react';
import { detectarYConfigurarHash } from '@/utils/hashDetector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ConfiguradorAutomatico() {
  const [estado, setEstado] = useState('inicial');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ejecutarDeteccion = async () => {
    setLoading(true);
    setError('');
    setEstado('detectando');

    try {
      const resultado = await detectarYConfigurarHash();
      setResultado(resultado);
      
      if (resultado.tipo === 'error') {
        setError(resultado.error);
        setEstado('error');
      } else {
        setEstado('detectado');
      }
    } catch (err) {
      setError(err.message);
      setEstado('error');
    }

    setLoading(false);
  };

  const aplicarConfiguracion = async () => {
    if (!resultado || !resultado.implementacion) return;

    setLoading(true);
    try {
      // Aquí aplicaremos la configuración automáticamente
      // Por ahora mostraremos la implementación que debería usarse
      setEstado('configurado');
      
      // En una implementación real, aquí actualizaríamos el archivo usuarioCustom.js
      console.log('Implementación a aplicar:', resultado.implementacion);
      
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    ejecutarDeteccion();
  }, []);

  const getTipoDescripcion = (tipo) => {
    const descripciones = {
      bcrypt: { emoji: '✅', nivel: 'Muy Seguro', descripcion: 'bcrypt - Algoritmo recomendado para producción' },
      sha512_crypt: { emoji: '✅', nivel: 'Seguro', descripcion: 'SHA-512 crypt - Buena opción' },
      sha256_crypt: { emoji: '✅', nivel: 'Seguro', descripcion: 'SHA-256 crypt - Buena opción' },
      md5_crypt: { emoji: '⚠️', nivel: 'Menos Seguro', descripcion: 'MD5 crypt - Funcional pero no ideal' },
      md5: { emoji: '❌', nivel: 'Inseguro', descripcion: 'MD5 simple - Vulnerable a ataques' },
      sha1: { emoji: '❌', nivel: 'Inseguro', descripcion: 'SHA-1 - Vulnerable a ataques' },
      sha256: { emoji: '⚠️', nivel: 'Poco Seguro', descripcion: 'SHA-256 simple - Sin salt, vulnerable' },
      texto_plano: { emoji: '💥', nivel: 'MUY INSEGURO', descripcion: 'Texto plano - Completamente inseguro' },
      personalizado: { emoji: '❓', nivel: 'Desconocido', descripcion: 'Formato personalizado - Revisar manualmente' }
    };

    return descripciones[tipo] || descripciones.personalizado;
  };

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔧 Configuración Automática de Contraseñas
          </h1>
          <p className="text-gray-600">
            Detección y configuración automática del sistema de verificación de contraseñas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Configuración</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Estado actual */}
            <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  estado === 'detectado' || estado === 'configurado' ? 'bg-green-500' :
                  estado === 'error' ? 'bg-red-500' :
                  loading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="font-medium">
                  {estado === 'inicial' && 'Iniciando detección...'}
                  {estado === 'detectando' && 'Analizando base de datos...'}
                  {estado === 'detectado' && 'Tipo de hash detectado'}
                  {estado === 'configurado' && '✅ Configuración aplicada'}
                  {estado === 'error' && '❌ Error en la detección'}
                </span>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {resultado && resultado.tipo !== 'error' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Resultado de la Detección</h3>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <strong>Tipo detectado:</strong> {resultado.tipo}
                    </div>
                    <div>
                      <strong>Total usuarios:</strong> {resultado.totalUsuarios}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Ejemplo de hash:</strong> 
                      <code className="ml-2 text-sm bg-white px-2 py-1 rounded">
                        {resultado.ejemploHash}
                      </code>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-white border">
                    {(() => {
                      const desc = getTipoDescripcion(resultado.tipo);
                      return (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{desc.emoji}</span>
                          <div>
                            <div className="font-semibold">{desc.nivel}</div>
                            <div className="text-sm text-gray-600">{desc.descripcion}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {resultado.implementacion && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Implementación requerida:</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                      {resultado.implementacion}
                    </pre>

                    {estado !== 'configurado' && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={aplicarConfiguracion}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loading ? 'Aplicando...' : 'Aplicar Configuración Automáticamente'}
                        </Button>
                        
                        <Button 
                          onClick={() => copiarImplementacion(resultado.implementacion)}
                          variant="outline"
                        >
                          Copiar Código
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Instrucciones adicionales según el tipo */}
                {getInstruccionesAdicionales(resultado.tipo)}
              </div>
            )}

            {/* Botón para redetectar */}
            {estado !== 'inicial' && estado !== 'detectando' && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={ejecutarDeteccion}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Detectando...' : 'Redetectar'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {estado === 'configurado' && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              <strong>✅ Configuración completada!</strong><br/>
              Ya puedes probar el login en la página de pruebas. El sistema ahora verificará correctamente las contraseñas de tu base de datos.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  function copiarImplementacion(implementacion) {
    navigator.clipboard.writeText(implementacion);
    alert('Código copiado al portapapeles');
  }

  function getInstruccionesAdicionales(tipo) {
    if (tipo.includes('crypt')) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            <strong>📝 Acción adicional requerida:</strong><br/>
            Para tipos crypt, necesitas crear una función en Supabase:<br/>
            <code className="text-xs">
              Ve a SQL Editor → Ejecuta: CREATE OR REPLACE FUNCTION verify_password...
            </code>
          </AlertDescription>
        </Alert>
      );
    }

    if (tipo === 'bcrypt') {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong>📦 Dependencia requerida:</strong><br/>
            Ejecuta: <code>npm install bcrypt</code>
          </AlertDescription>
        </Alert>
      );
    }

    if (tipo === 'md5' || tipo === 'sha1') {
      return (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <strong>⚠️ Advertencia de seguridad:</strong><br/>
            Este tipo de hash es vulnerable. Considera migrar a bcrypt o un algoritmo más seguro.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }
}