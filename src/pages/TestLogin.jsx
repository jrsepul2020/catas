import React, { useState, useEffect } from 'react';
import { UsuarioCustom } from '@/api/usuarioCustom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TestLogin() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsuarios();
    checkCurrentUser();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await UsuarioCustom.getAllUsers();
      setUsuarios(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  const checkCurrentUser = async () => {
    const user = await UsuarioCustom.getUser();
    setCurrentUser(user);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await UsuarioCustom.signIn(loginData.email, loginData.password);
      setCurrentUser(result.user);
      setMessage(`✅ Login exitoso como ${result.user.email}`);
      setLoginData({ email: '', password: '' });
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await UsuarioCustom.signOut();
    setCurrentUser(null);
    setMessage('✅ Sesión cerrada');
  };

  const quickLogin = (email) => {
    setLoginData({ ...loginData, email });
  };

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔐 Test Login Personalizado
          </h1>
          <p className="text-gray-600">
            Prueba el sistema de autenticación con tu tabla usuarios personalizada
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Estado actual */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Autenticación</CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800">✅ Usuario Autenticado</h4>
                    <div className="mt-2 text-green-700 text-sm space-y-1">
                      <p><strong>ID:</strong> {currentUser.id}</p>
                      <p><strong>Email:</strong> {currentUser.email}</p>
                      {currentUser.nombre && <p><strong>Nombre:</strong> {currentUser.nombre}</p>}
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800">❌ No Autenticado</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Usa el formulario de login para autenticarte
                  </p>
                </div>
              )}

              {message && (
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Formulario de login */}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  style={{ background: '#390B0B' }}
                >
                  {loading ? 'Verificando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lista de usuarios para testing */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Disponibles (para testing)</CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Haz click en un email para rellenar el formulario de login automáticamente:
                </p>
                
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {usuarios.map((usuario, idx) => (
                    <div 
                      key={idx}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => quickLogin(usuario.email)}
                    >
                      <div className="font-medium text-sm">{usuario.email}</div>
                      {usuario.nombre && (
                        <div className="text-xs text-gray-500">{usuario.nombre}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">⚠️ Configuración Necesaria</h4>
                  <div className="text-yellow-700 text-sm mt-2 space-y-1">
                    <p>El sistema actual usa verificación insegura de contraseñas para testing.</p>
                    <p><strong>Para producción, necesitas:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Implementar hash seguro (bcrypt, scrypt, etc.)</li>
                      <li>Configurar la función <code>verifyPassword()</code> en <code>usuarioCustom.js</code></li>
                      <li>¿Cómo están hasheadas las contraseñas en tu BD?</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No se pudieron cargar los usuarios</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}