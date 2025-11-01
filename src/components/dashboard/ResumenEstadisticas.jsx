import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function ResumenEstadisticas({ catas, muestras, isLoading }) {
  // Calcular estadísticas por tipo de vino
  const statsByTipo = React.useMemo(() => {
    const stats = {};
    
    catas.forEach(cata => {
      const muestra = muestras.find(m => m.id === cata.muestra_id);
      if (muestra && muestra.tipo) {
        if (!stats[muestra.tipo]) {
          stats[muestra.tipo] = { tipo: muestra.tipo, count: 0, totalPuntos: 0 };
        }
        stats[muestra.tipo].count += 1;
        stats[muestra.tipo].totalPuntos += cata.puntuacion_total || 0;
      }
    });

    return Object.values(stats).map(s => ({
      tipo: s.tipo,
      promedio: s.count > 0 ? (s.totalPuntos / s.count).toFixed(1) : 0,
      catas: s.count
    }));
  }, [catas, muestras]);

  if (isLoading || catas.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
      <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
        <CardTitle className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Puntuaciones por Tipo de Vino
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statsByTipo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce8e8" />
            <XAxis dataKey="tipo" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #fce8e8',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="promedio" fill="#390B0B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}