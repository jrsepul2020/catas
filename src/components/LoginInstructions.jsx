import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Info, Users, Crown, Settings } from 'lucide-react';

const LoginInstructions = () => {
  return (
    <div className="mt-6 space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Aplicación Local Vinísima</strong><br />
          Sistema simplificado para 30 usuarios. Selecciona tu perfil para acceder rápidamente.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
              <Crown className="w-4 h-4" />
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-yellow-700">
              Acceso completo al sistema. Pueden usar login tradicional con email/contraseña o acceso rápido.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
              <Users className="w-4 h-4" />
              Catadores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-blue-700">
              Senior y regulares. Acceso directo mediante selección de perfil. Sin contraseñas complejas.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-800">
              <Settings className="w-4 h-4" />
              Personal Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-green-700">
              Apoyo y técnicos. Acceso rápido para funciones específicas del sistema.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginInstructions;