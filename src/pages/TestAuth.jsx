import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../api/supabaseClient';

const TestAuth = () => {
  const [email, setEmail] = useState('test@vinisima.com');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setResult(`❌ Error: ${error.message}`);
      } else {
        setResult(`✅ Registro exitoso! Usuario: ${data.user?.email}`);
      }
    } catch (err) {
      setResult(`❌ Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setResult(`❌ Error: ${error.message}`);
      } else {
        setResult(`✅ Login exitoso! Usuario: ${data.user?.email}`);
      }
    } catch (err) {
      setResult(`❌ Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`❌ Error de conexión: ${error.message}`);
      } else {
        setResult(`✅ Conexión exitosa! Sesión actual: ${data.session ? 'Logueado' : 'No logueado'}`);
      }
    } catch (err) {
      setResult(`❌ Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test de Autenticación Supabase</CardTitle>
          <CardDescription>
            Prueba el sistema de autenticación con Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email de prueba:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@vinisima.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña de prueba:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={testConnection}
              disabled={loading}
              variant="outline"
            >
              🔍 Test Conexión
            </Button>
            <Button 
              onClick={testSignUp}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              ✨ Crear Cuenta
            </Button>
            <Button 
              onClick={testSignIn}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🔐 Login
            </Button>
          </div>

          {result && (
            <Alert className={result.includes('✅') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <AlertDescription>
                {result}
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2">📋 Instrucciones:</h4>
              <div className="text-sm space-y-1 text-gray-600">
                <p>1. <strong>Test Conexión:</strong> Verifica que Supabase funcione</p>
                <p>2. <strong>Crear Cuenta:</strong> Registra un usuario de prueba</p>
                <p>3. <strong>Login:</strong> Inicia sesión con el usuario creado</p>
                <p>4. Una vez logueado, deberías ver la aplicación completa</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAuth;