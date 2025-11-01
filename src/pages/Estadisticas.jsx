import React from "react";
import { Cata, Muestra } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, Wine, Target } from "lucide-react";

const COLORS = ['#390B0B', '#5a1616', '#7a1f1f', '#9b1c1c', '#c92a2a'];

export default function Estadisticas() {
  const { data: catas, isLoading: loadingCatas } = useQuery({
    queryKey: ['catas'],
    queryFn: () => Cata.list('-created_at'),
    initialData: [],
  });

  const { data: muestras, isLoading: loadingMuestras } = useQuery({
    queryKey: ['muestras'],
    queryFn: () => Muestra.list(),
    initialData: [],
  });

  // Estadísticas por tipo
  const statsByTipo = React.useMemo(() => {
    const stats = {};
    catas.forEach(cata => {
      const muestra = muestras.find(m => m.id === cata.muestra_id);
      if (muestra?.tipo) {
        if (!stats[muestra.tipo]) {
          stats[muestra.tipo] = { tipo: muestra.tipo, count: 0, totalPuntos: 0 };
        }
        stats[muestra.tipo].count += 1;
        stats[muestra.tipo].totalPuntos += cata.puntuacion_total || 0;
      }
    });
    return Object.values(stats).map(s => ({
      tipo: s.tipo,
      promedio: s.count > 0 ? parseFloat((s.totalPuntos / s.count).toFixed(1)) : 0,
      catas: s.count
    }));
  }, [catas, muestras]);

  // Top 5 vinos mejor puntuados
  const topVinos = React.useMemo(() => {
    const vinosConPuntos = catas.map(cata => {
      const muestra = muestras.find(m => m.id === cata.muestra_id);
      return {
        nombre: muestra?.nombre || 'Desconocido',
        puntuacion: cata.puntuacion_total || 0
      };
    });
    
    return vinosConPuntos
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 5);
  }, [catas, muestras]);

  // Distribución por fases
  const promedioFases = React.useMemo(() => {
    if (catas.length === 0) return [];
    
    const totalVisual = catas.reduce((sum, c) => sum + (c.puntuacion_visual || 0), 0) / catas.length;
    const totalOlfativa = catas.reduce((sum, c) => sum + (c.puntuacion_olfativa || 0), 0) / catas.length;
    const totalGustativa = catas.reduce((sum, c) => sum + (c.puntuacion_gustativa || 0), 0) / catas.length;

    return [
      { fase: 'Visual', valor: parseFloat(totalVisual.toFixed(1)) },
      { fase: 'Olfativa', valor: parseFloat(totalOlfativa.toFixed(1)) },
      { fase: 'Gustativa', valor: parseFloat(totalGustativa.toFixed(1)) }
    ];
  }, [catas]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Estadísticas</h1>
          <p className="text-gray-600 text-sm md:text-base">Análisis detallado de tus catas de vino</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-white shadow-md" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Total Catas
                </CardTitle>
                <Wine className="w-6 h-6 md:w-8 md:h-8" style={{ color: '#390B0B' }} />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{catas.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-white shadow-md" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Puntuación Media
                </CardTitle>
                <Target className="w-6 h-6 md:w-8 md:h-8 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {catas.length > 0 
                  ? (catas.reduce((sum, c) => sum + (c.puntuacion_total || 0), 0) / catas.length).toFixed(1)
                  : '0.0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sobre 100</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-md" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Mejor Puntuación
                </CardTitle>
                <Award className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {catas.length > 0 
                  ? Math.max(...catas.map(c => c.puntuacion_total || 0)).toFixed(1)
                  : '0.0'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white shadow-md" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Vinos Únicos
                </CardTitle>
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {new Set(catas.map(c => c.muestra_id)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">
                Puntuaciones por Tipo de Vino
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsByTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce8e8" />
                  <XAxis dataKey="tipo" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#390B0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">
                Top 5 Vinos Mejor Puntuados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topVinos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce8e8" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                  <YAxis dataKey="nombre" type="category" width={100} stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="puntuacion" fill="#5a1616" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">
                Promedio por Fases de Cata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={promedioFases}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce8e8" />
                  <XAxis dataKey="fase" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">
                Distribución por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsByTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.tipo}: ${entry.catas}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="catas"
                  >
                    {statsByTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}