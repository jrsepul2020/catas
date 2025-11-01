import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextSupabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Wine, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import EmailConfirmation from './EmailConfirmation';

const SupabaseLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  const { signIn, signUp, resetPassword } = useAuth();

  // Función para limpiar mensajes
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Función para volver del email confirmation
  const handleBackFromEmailConfirmation = () => {
    setShowEmailConfirmation(false);
    setPendingEmail('');
    setIsSignUp(false); // Cambiar a modo login
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    clearMessages();

    try {
      console.log('🔄 Intentando auth con Supabase:', { email, isSignUp });
      
      if (isSignUp) {
        await signUp(email, password);
        // Guardar email y mostrar pantalla de confirmación
        setPendingEmail(email);
        setShowEmailConfirmation(true);
        return; // No mostrar mensaje de éxito aquí
      } else {
        await signIn(email, password);
        setSuccess('¡Bienvenido a Vinísima! 🍷');
        console.log('✅ Login exitoso');
      }
      
    } catch (error) {
      console.error('❌ Auth error:', error);
      
      // Manejo de errores específicos de Supabase
      let errorMessage = 'Error de autenticación';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Revisa tu email')) {
        // Mostrar pantalla de confirmación en lugar de mensaje
        setPendingEmail(email);
        setShowEmailConfirmation(true);
        return;
      } else if (error.message.includes('email')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar recuperación de contraseña
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Introduce tu email primero para recuperar la contraseña');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await resetPassword(email);
      setSuccess('¡Email de recuperación enviado! Revisa tu bandeja de entrada. 📧');
      setShowForgotPassword(false);
    } catch (error) {
      setError('Error enviando email de recuperación: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Si estamos en el flujo de confirmación de email
  if (showEmailConfirmation) {
    return (
      <EmailConfirmation 
        email={pendingEmail} 
        onBack={handleBackFromEmailConfirmation} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-in zoom-in-0 delay-200">
              <Wine className="w-10 h-10 text-white transition-transform duration-300 hover:rotate-12" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Vinisima
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {isSignUp ? 'Crear nueva cuenta' : 'Sistema de Gestión de Catas de Vino'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-12 bg-white border-gray-300 focus:border-red-500 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-12 bg-white border-gray-300 focus:border-red-500 focus:ring-red-500 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500">
                    Mínimo 6 caracteres
                  </p>
                )}
              </div>

              {/* Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-semibold text-base shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="animate-pulse">
                      {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2 transition-all duration-200">
                    <span className="text-lg">
                      {isSignUp ? '✨' : '🔐'}
                    </span>
                    {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                  </span>
                )}
              </Button>
            </form>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
              {/* Forgot Password - solo mostrar en modo login */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (showForgotPassword) {
                        handleForgotPassword();
                      } else {
                        setShowForgotPassword(true);
                        clearMessages();
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200 hover:underline"
                    disabled={loading}
                  >
                    {showForgotPassword ? 'Enviar email de recuperación' : '¿Olvidaste tu contraseña?'}
                  </button>
                  
                  {showForgotPassword && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          clearMessages();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Toggle Sign Up / Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    clearMessages();
                    setShowForgotPassword(false);
                    // Mantener email pero limpiar contraseña para seguridad
                    setPassword('');
                  }}
                  className="text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:scale-105"
                  disabled={loading}
                >
                  {isSignUp 
                    ? '¿Ya tienes cuenta? Iniciar sesión' 
                    : '¿No tienes cuenta? Crear una nueva'
                  }
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-red-50 rounded-lg p-4">
              <div className="text-xs text-red-700 space-y-2">
                {isSignUp ? (
                  <>
                    <p className="flex items-center gap-2">
                      <span>📧</span>
                      <strong>Recibirás un email de confirmación</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🔒</span>
                      Usa una contraseña segura de al menos 6 caracteres
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2">
                      <span>💡</span>
                      <strong>Primera vez?</strong> Crea una cuenta nueva
                    </p>
                    <p className="flex items-center gap-2">
                      <span>⚡</span>
                      Sistema seguro con Supabase Auth
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseLogin;