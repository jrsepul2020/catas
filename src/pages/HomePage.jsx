import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Wine, 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  ClipboardCheck,
  Users,
  TestTube,
  Lock,
  Search,
  Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContextDebug';

const HomePage = () => {
  const { user } = useAuth();

  const mainPages = [
    {
      title: "📊 Dashboard",
      description: "Panel principal con resumen de actividades",
      url: "/Dashboard",
      icon: LayoutDashboard,
      color: "bg-blue-500"
    },
    {
      title: "🍷 Nueva Cata",
      description: "Crear nueva cata de vinos tranquilos",
      url: "/NuevaCata",
      icon: ClipboardCheck,
      color: "bg-green-500"
    },
    {
      title: "🥃 Cata Espirituosos",
      description: "Crear cata de destilados y espirituosos",
      url: "/CataEspirituosos",
      icon: Wine,
      color: "bg-amber-500"
    },
    {
      title: "📅 Tandas",
      description: "Gestión de tandas de cata",
      url: "/Tandas",
      icon: CalendarDays,
      color: "bg-purple-500"
    },
    {
      title: "📈 Estadísticas",
      description: "Análisis y reportes de catas",
      url: "/Estadisticas",
      icon: BarChart3,
      color: "bg-red-500"
    },
    {
      title: "⚙️ Configuración",
      description: "Configuración del perfil y aplicación",
      url: "/Configuracion",
      icon: Settings,
      color: "bg-gray-500"
    }
  ];

  const testPages = [
    {
      title: "🔐 Test Supabase Auth",
      description: "Probar autenticación con Supabase",
      url: "/TestAuth",
      icon: Lock,
      color: "bg-indigo-500"
    },
    {
      title: "👥 Consulta Usuarios",
      description: "Ver usuarios en la base de datos",
      url: "/ConsultaUsuarios",
      icon: Users,
      color: "bg-teal-500"
    },
    {
      title: "🧪 Prueba Login Custom",
      description: "Probar sistema de login personalizado",
      url: "/PruebaLogin",
      icon: TestTube,
      color: "bg-orange-500"
    },
    {
      title: "🔍 Analizar Passwords",
      description: "Herramienta de análisis de hashes",
      url: "/AnalizarPasswords",
      icon: Search,
      color: "bg-pink-500"
    },
    {
      title: "🗄️ Test Supabase DB",
      description: "Probar conexión a base de datos",
      url: "/TestSupabase",
      icon: Database,
      color: "bg-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center shadow-lg">
              <Wine className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Vinisima</h1>
              <p className="text-gray-600">Sistema de Gestión de Catas de Vino</p>
            </div>
          </div>
          
          {user && (
            <div className="bg-white rounded-lg p-4 shadow-sm border inline-flex items-center gap-2">
              <span className="text-sm text-gray-600">👤 Logueado como:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
          )}
        </div>

        {/* Páginas Principales */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Funcionalidades Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainPages.map((page, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center`}>
                      <page.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-600">
                    {page.description}
                  </CardDescription>
                  <Link to={page.url}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                      Abrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Páginas de Testing */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TestTube className="w-6 h-6" />
            Herramientas de Testing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPages.map((page, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center`}>
                      <page.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-600">
                    {page.description}
                  </CardDescription>
                  <Link to={page.url}>
                    <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                      Probar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>✅ Migración Base44 → Supabase completada</p>
          <p>🔐 Sistema de autenticación funcional</p>
          <p>🗄️ Base de datos PostgreSQL configurada</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;