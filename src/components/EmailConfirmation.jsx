import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContextSupabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';

const EmailConfirmation = ({ email, onBack }) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { signUp } = useAuth();

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    try {
      // Intentar registrar de nuevo para reenviar email de confirmación
      await signUp(email, 'temp-password-for-resend');
    } catch (error) {
      if (error.message.includes('User already registered') || 
          error.message.includes('already been registered')) {
        setResendMessage('✅ Email de confirmación reenviado exitosamente');
      } else {
        setResendMessage('❌ Error reenviando email: ' + error.message);
      }
    } finally {
      setResendLoading(false);
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Confirma tu Email
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-base">
              Te hemos enviado un email de confirmación
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Información del email */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Email enviado a:
                  </span>
                </div>
                <div className="bg-white rounded px-3 py-2 border border-blue-300">
                  <span className="text-gray-900 font-mono text-sm">
                    {email}
                  </span>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                    1
                  </span>
                  <p>Revisa tu bandeja de entrada y la carpeta de spam</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                    2
                  </span>
                  <p>Haz clic en el enlace de confirmación en el email</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                    3
                  </span>
                  <p>Regresa aquí e inicia sesión con tu cuenta</p>
                </div>
              </div>

              {/* Mensaje de reenvío */}
              {resendMessage && (
                <Alert className={resendMessage.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <AlertDescription className={resendMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                    {resendMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Botón de reenvío */}
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={resendLoading || !canResend}
                  variant="outline"
                  className="w-full h-12 border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  {resendLoading ? (
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reenviando...</span>
                    </div>
                  ) : canResend ? (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      <span>Reenviar Email</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4" />
                      <span>Reenviar en {countdown}s</span>
                    </div>
                  )}
                </Button>

                {/* Botón volver */}
                <Button
                  onClick={onBack}
                  variant="ghost"
                  className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Login
                </Button>
              </div>

              {/* Ayuda */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <span>💡</span>
                    <strong>¿No recibes el email?</strong> Revisa tu carpeta de spam
                  </p>
                  <p className="flex items-center gap-2">
                    <span>⏱️</span>
                    El email puede tardar hasta 5 minutos en llegar
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

EmailConfirmation.propTypes = {
  email: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default EmailConfirmation;