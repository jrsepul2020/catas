import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wine, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const tipoColors = {
  "Tinto": "bg-red-50 text-red-900 border-red-200",
  "Blanco": "bg-yellow-50 text-yellow-900 border-yellow-200",
  "Rosado": "bg-pink-50 text-pink-900 border-pink-200",
  "Espumoso": "bg-blue-50 text-blue-900 border-blue-200",
  "Generoso": "bg-orange-50 text-orange-900 border-orange-200"
};

export default function MuestrasPendientes({ muestras, isLoading }) {
  return (
    <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
      <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
        <CardTitle className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wine className="w-5 h-5" style={{ color: '#390B0B' }} />
          Muestras Pendientes de Cata
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : muestras.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Wine className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No hay muestras pendientes</p>
            <p className="text-sm text-gray-400 mt-1">Añade nuevas muestras para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {muestras.slice(0, 5).map(muestra => (
              <Link 
                key={muestra.id}
                to={createPageUrl("DetalleMuestra") + "?id=" + muestra.id}
                className="block group"
              >
                <div className="p-3 md:p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-white" style={{ borderColor: '#fce8e8', ':hover': { borderColor: '#f7d4d4' } }}>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-gray-800 transition-colors text-sm md:text-base" style={{ color: 'inherit' }}>
                      {muestra.nombre}
                    </h3>
                    <Badge className={`${tipoColors[muestra.tipo]} border text-xs`}>
                      {muestra.tipo}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs md:text-sm text-gray-600">
                    {muestra.bodega && (
                      <p className="flex items-center gap-2">
                        <Wine className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        {muestra.bodega}
                      </p>
                    )}
                    {muestra.origen && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        {muestra.origen}
                      </p>
                    )}
                    {muestra.año && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        Cosecha {muestra.año}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}