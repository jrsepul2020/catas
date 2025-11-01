import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { UsuarioCustom } from '../api/usuarioCustom';

const PruebaLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setResult(null);
    setUserInfo(null);

    try {
      console.log('🔍 Intentando login con:', email);
      const loginResult = await UsuarioCustom.signIn(email, password);
      
      if (loginResult.success) {
        setResult({
          type: 'success',
          message: '✅ Login exitoso!'
        });
        setUserInfo(loginResult.user);
      } else {
        setResult({
          type: 'error',
          message: `❌ Error: ${loginResult.error}`
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Error inesperado: ${error.message}`
      });
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await UsuarioCustom.signOut();
      setUserInfo(null);
      setResult({
        type: 'success',
        message: '✅ Logout exitoso'
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Error en logout: ${error.message}`
      });
    }
  };

  const getCurrentUser = () => {
    const currentUser = UsuarioCustom.getCurrentUser();
    setUserInfo(currentUser);
    setResult({
      type: 'info',
      message: currentUser ? '✅ Usuario logueado encontrado' : '❌ No hay usuario logueado'
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Prueba de Sistema de Autenticación</CardTitle>
          <CardDescription>
            Prueba el login con tu tabla usuarios personalizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email / Usuario
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleLogin} 
              disabled={loading || !email || !password}
              className="flex-1"
            >
              {loading ? 'Verificando...' : '🔑 Iniciar Sesión'}
            </Button>
            <Button 
              variant="outline" 
              onClick={getCurrentUser}
            >
              👤 Estado Actual
            </Button>
            {userInfo && (
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                🚪 Salir
              </Button>
            )}
          </div>

          {result && (
            <Alert className={result.type === 'success' ? 'border-green-500 bg-green-50' : 
                              result.type === 'error' ? 'border-red-500 bg-red-50' : 
                              'border-blue-500 bg-blue-50'}>
              <AlertDescription>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {userInfo && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">👤 Usuario Autenticado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">ID</Badge>
                    <span className="font-mono text-sm">{userInfo.id}</span>
                  </div>
                  {userInfo.email && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Email</Badge>
                      <span>{userInfo.email}</span>
                    </div>
                  )}
                  {userInfo.nombre && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Nombre</Badge>
                      <span>{userInfo.nombre}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Tipo Hash</Badge>
                    <span className="font-mono text-sm">
                      {userInfo.password_hash ? 
                        UsuarioCustom.detectHashType(userInfo.password_hash) : 
                        'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">📋 Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Ingresa tus credenciales:</strong> Usa un email/usuario que exista en tu tabla `usuarios`</p>
            <p><strong>2. Observa la consola:</strong> Se mostrará el tipo de hash detectado</p>
            <p><strong>3. Si usa crypt:</strong> Necesitarás ejecutar `supabase-password-functions.sql` en Supabase</p>
            <p><strong>4. Si usa bcrypt:</strong> Ejecuta `npm install bcrypt` en el terminal</p>
            <p><strong>5. Revisa los logs:</strong> Se mostrarán detalles de la verificación</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PruebaLogin;