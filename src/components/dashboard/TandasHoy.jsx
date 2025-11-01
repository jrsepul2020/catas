import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const estadoColors = {
  "Programada": "bg-blue-50 text-blue-900 border-blue-200",
  "En Curso": "bg-green-50 text-green-900 border-green-200",
  "Finalizada": "bg-gray-50 text-gray-900 border-gray-200",
  "Cancelada": "bg-red-50 text-red-900 border-red-200"
};

export default function TandasHoy({ tandas, isLoading }) {
  return (
    <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
      <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
        <CardTitle className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-600" />
          Tandas de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : tandas.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No hay tandas programadas hoy</p>
            <p className="text-sm text-gray-400 mt-1">Programa una nueva sesión de cata</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tandas.map(tanda => (
              <Link 
                key={tanda.id}
                to={createPageUrl("DetalleTanda") + "?id=" + tanda.id}
                className="block group"
              >
                <div className="p-3 md:p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-white" style={{ borderColor: '#fce8e8' }}>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-gray-800 transition-colors text-sm md:text-base">
                      {tanda.nombre}
                    </h3>
                    <Badge className={`${estadoColors[tanda.estado]} border text-xs`}>
                      {tanda.estado}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs md:text-sm text-gray-600">
                    {tanda.hora && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        {tanda.hora}
                      </p>
                    )}
                    {tanda.lugar && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        {tanda.lugar}
                      </p>
                    )}
                    {tanda.numero_catadores && (
                      <p className="flex items-center gap-2">
                        <Users className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        {tanda.numero_catadores} catadores
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