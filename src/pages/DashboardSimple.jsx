import { useAuth } from '../contexts/AuthSimple';
import { Wine, Calendar, Users, TrendingUp } from 'lucide-react';

export default function DashboardSimple() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-6 pr-6 pb-6 pl-6" style={{ backgroundColor: '#fff5f5' }}>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard - Vinisima
          </h1>
          <p className="text-gray-600">
            Bienvenido, <span className="font-semibold">{user?.nombre}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#390B0B' }}>
            <div className="flex items-center justify-between mb-4">
              <Wine className="w-10 h-10" style={{ color: '#390B0B' }} />
              <span className="text-3xl font-bold text-gray-800">12</span>
            </div>
            <h3 className="text-gray-600 font-medium">Muestras Pendientes</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-600">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10 text-rose-600" />
              <span className="text-3xl font-bold text-gray-800">3</span>
            </div>
            <h3 className="text-gray-600 font-medium">Tandas de Hoy</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-purple-600" />
              <span className="text-3xl font-bold text-gray-800">28</span>
            </div>
            <h3 className="text-gray-600 font-medium">Catadores Activos</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
              <span className="text-3xl font-bold text-gray-800">87.5</span>
            </div>
            <h3 className="text-gray-600 font-medium">Puntuación Media</h3>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Muestras Pendientes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Muestras Pendientes</h2>
            <div className="space-y-3">
              {[
                { id: 1, nombre: 'Rioja Reserva 2019', lote: 'L-2024-001', fecha: '10/11/2025' },
                { id: 2, nombre: 'Ribera del Duero 2020', lote: 'L-2024-002', fecha: '10/11/2025' },
                { id: 3, nombre: 'Albariño 2023', lote: 'L-2024-003', fecha: '11/11/2025' },
              ].map((muestra) => (
                <div key={muestra.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#390B0B' }}>
                      <Wine className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{muestra.nombre}</p>
                      <p className="text-sm text-gray-500">Lote: {muestra.lote}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-orange-700" style={{ backgroundColor: '#fed7aa' }}>
                      Pendiente
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{muestra.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tandas de Hoy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tandas de Hoy</h2>
            <div className="space-y-3">
              {[
                { id: 1, nombre: 'Tanda Mañana', hora: '10:00', catadores: 5 },
                { id: 2, nombre: 'Tanda Tarde', hora: '16:00', catadores: 8 },
                { id: 3, nombre: 'Tanda Extra', hora: '18:30', catadores: 3 },
              ].map((tanda) => (
                <div key={tanda.id} className="p-4 rounded-lg border-2" style={{ borderColor: '#390B0B', backgroundColor: '#fff5f5' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: '#390B0B' }} />
                    <p className="font-semibold text-gray-800">{tanda.nombre}</p>
                  </div>
                  <p className="text-sm text-gray-600">{tanda.hora}</p>
                  <p className="text-xs text-gray-500 mt-1">{tanda.catadores} catadores</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border" style={{ borderColor: '#390B0B' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Información de Usuario</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nombre:</span>
              <p className="font-semibold text-gray-800">{user?.nombre}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Rol:</span>
              <p className="font-semibold text-gray-800 capitalize">{user?.rol}</p>
            </div>
            <div>
              <span className="text-gray-600">Tablet:</span>
              <p className="font-semibold text-gray-800">{user?.ntablet}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
