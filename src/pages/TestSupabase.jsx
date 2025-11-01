import React, { useEffect, useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { Muestra, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [user, setUser] = useState(null);
  const [muestras, setMuestras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Probar conexión a Supabase
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test básico de conexión
        const { data, error } = await supabase.from('muestras').select('count', { count: 'exact', head: true });
        
        if (error) {
          if (error.code === 'PGRST116') {
            setConnectionStatus('✅ Conectado - Tabla "muestras" no existe aún. Necesitas ejecutar el SQL.');
          } else {
            setConnectionStatus(`❌ Error: ${error.message}`);
          }
        } else {
          setConnectionStatus('✅ Conectado correctamente a Supabase');
        }
      } catch (err) {
        setConnectionStatus(`❌ Error de conexión: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  // Obtener usuario actual
  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.getUser();
        setUser(currentUser);
      } catch (err) {
        console.log('No hay usuario autenticado:', err.message);
      }
    };

    getUser();
  }, []);

  // Probar obtener muestras
  const testMuestras = async () => {
    setLoading(true);
    try {
      const data = await Muestra.list();
      setMuestras(data);
      alert(`✅ Éxito: Se obtuvieron ${data.length} muestras`);
    } catch (err) {
      alert(`❌ Error al obtener muestras: ${err.message}`);
    }
    setLoading(false);
  };

  // Crear muestra de prueba
  const createTestMuestra = async () => {
    if (!user) {
      alert('❌ Necesitas estar autenticado para crear muestras');
      return;
    }

    setLoading(true);
    try {
      const testData = {
        nombre: `Vino de Prueba ${Date.now()}`,
        tipo: 'Vino',
        denominacion: 'Test DO',
        bodega: 'Bodega Test',
        cosecha: 2023,
        graduacion: 14.5,
        estado: 'Pendiente',
        notas: 'Muestra creada para probar la conexión con Supabase'
      };

      const result = await Muestra.create(testData);
      alert(`✅ Muestra creada exitosamente: ${result.nombre}`);
      
      // Actualizar lista
      testMuestras();
    } catch (err) {
      alert(`❌ Error al crear muestra: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Test de Conexión Supabase
          </h1>
          <p className="text-gray-600">
            Verifica que la migración de Base44 a Supabase funcione correctamente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Conexión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{connectionStatus}</p>
              
              {connectionStatus.includes('Tabla "muestras" no existe') && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">⚠️ Acción requerida:</h4>
                  <p className="text-yellow-700 mt-1">
                    Ve a tu panel de Supabase → SQL Editor y ejecuta el archivo <code>supabase-schema.sql</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuario Actual</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div>
                  <p>✅ <strong>Autenticado</strong></p>
                  <p>Email: {user.email}</p>
                  <p>ID: {user.id}</p>
                </div>
              ) : (
                <div>
                  <p>❌ <strong>No autenticado</strong></p>
                  <p className="text-sm text-gray-600 mt-2">
                    Necesitarás implementar login para usar todas las funciones
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test de Entidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button 
                onClick={testMuestras}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Cargando...' : 'Probar Obtener Muestras'}
              </Button>
              
              <Button 
                onClick={createTestMuestra}
                disabled={loading || !user}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creando...' : 'Crear Muestra de Prueba'}
              </Button>
            </div>

            {muestras.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Muestras encontradas ({muestras.length}):</h4>
                <div className="max-h-40 overflow-y-auto">
                  {muestras.map((muestra, idx) => (
                    <div key={idx} className="text-sm border-b pb-1 mb-1">
                      <strong>{muestra.nombre}</strong> - {muestra.tipo} ({muestra.estado})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Si ves "Tabla no existe", ejecuta <code>supabase-schema.sql</code> en Supabase</li>
              <li>Implementa autenticación para que los usuarios puedan hacer login</li>
              <li>Prueba crear muestras, tandas y catas desde la interfaz principal</li>
              <li>Todo debería funcionar igual que antes, pero ahora con Supabase</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}