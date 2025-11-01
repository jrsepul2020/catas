
import { Muestra, Tanda, Cata } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Wine, Calendar, ClipboardList, Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import MuestrasPendientes from "../components/dashboard/MuestrasPendientes";
import TandasHoy from "../components/dashboard/TandasHoy";
import ResumenEstadisticas from "../components/dashboard/ResumenEstadisticas";

export default function Dashboard() {
  const { data: muestras, isLoading: loadingMuestras } = useQuery({
    queryKey: ['muestras'],
    queryFn: () => Muestra.list('-created_at'),
    initialData: [],
  });

  const { data: tandas, isLoading: loadingTandas } = useQuery({
    queryKey: ['tandas'],
    queryFn: () => Tanda.list('-fecha'),
    initialData: [],
  });

  const { data: catas, isLoading: loadingCatas } = useQuery({
    queryKey: ['catas'],
    queryFn: () => Cata.list('-created_at'),
    initialData: [],
  });

  const muestrasPendientes = muestras.filter(m => m.estado === 'Pendiente');
  const hoy = format(new Date(), 'yyyy-MM-dd');
  const tandasHoy = tandas.filter(t => t.fecha === hoy && t.estado !== 'Cancelada');

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("NuevaMuestra")} className="flex-1 md:flex-none">
              <Button className="w-full text-white shadow-lg" style={{ background: '#390B0B' }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Muestra
              </Button>
            </Link>
            <Link to={createPageUrl("NuevaTanda")} className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full text-[#390B0B] hover:bg-red-50" style={{ borderColor: '#390B0B' }}>
                <Calendar className="w-4 h-4 mr-2" />
                Nueva Tanda
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Muestras Pendientes
                </CardTitle>
                <Wine className="w-6 h-6 md:w-8 md:h-8" style={{ color: '#390B0B' }} />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{muestrasPendientes.length}</p>
              <p className="text-xs text-gray-500 mt-1">Por catar</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-white shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Tandas de Hoy
                </CardTitle>
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{tandasHoy.length}</p>
              <p className="text-xs text-gray-500 mt-1">Programadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Total Catas
                </CardTitle>
                <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{catas.length}</p>
              <p className="text-xs text-gray-500 mt-1">Realizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: '#fce8e8' }}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                  Puntuación Media
                </CardTitle>
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
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
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <MuestrasPendientes 
              muestras={muestrasPendientes} 
              isLoading={loadingMuestras}
            />
          </div>
          <div>
            <TandasHoy 
              tandas={tandasHoy} 
              isLoading={loadingTandas}
            />
          </div>
        </div>

        {/* Statistics Summary */}
        <ResumenEstadisticas 
          catas={catas}
          muestras={muestras}
          isLoading={loadingCatas || loadingMuestras}
        />
      </div>
    </div>
  );
}