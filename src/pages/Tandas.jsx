import React, { useState } from "react";
import { Tanda, Muestra } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, MapPin, Users, Wine } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import FormularioTanda from "../components/tandas/FormularioTanda";

const estadoColors = {
  "Programada": "bg-blue-50 text-blue-900 border-blue-200",
  "En Curso": "bg-green-50 text-green-900 border-green-200",
  "Finalizada": "bg-gray-50 text-gray-900 border-gray-200",
  "Cancelada": "bg-red-50 text-red-900 border-red-200"
};

export default function Tandas() {
  const [showForm, setShowForm] = useState(false);
  const [editingTanda, setEditingTanda] = useState(null);
  const queryClient = useQueryClient();

  const { data: tandas, isLoading } = useQuery({
    queryKey: ['tandas'],
    queryFn: () => Tanda.list('-fecha'),
    initialData: [],
  });

  const { data: muestras } = useQuery({
    queryKey: ['muestras'],
    queryFn: () => Muestra.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => Tanda.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tandas'] });
      setShowForm(false);
      setEditingTanda(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Tanda.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tandas'] });
      setShowForm(false);
      setEditingTanda(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingTanda) {
      updateMutation.mutate({ id: editingTanda.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (tanda) => {
    setEditingTanda(tanda);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="max-w-[98rem] mr-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Gestión de Tandas</h1>
            <p className="text-gray-600 text-sm md:text-base">Organiza y programa tus sesiones de cata</p>
          </div>
          <Button
            onClick={() => {
              setEditingTanda(null);
              setShowForm(!showForm);
            }}
            className="w-full md:w-auto text-white shadow-lg"
            style={{ background: '#390B0B' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tanda
          </Button>
        </div>

        {showForm && (
          <FormularioTanda
            tanda={editingTanda}
            muestras={muestras}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTanda(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}

        <div className="grid gap-4 md:gap-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : tandas.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 md:p-12 text-center">
                <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">No hay tandas programadas</p>
                <p className="text-sm text-gray-400">Crea tu primera tanda para comenzar</p>
              </CardContent>
            </Card>
          ) : (
            tandas.map(tanda => {
              const muestrasTanda = muestras.filter(m => 
                tanda.muestras_ids?.includes(m.id)
              );

              return (
                <Card 
                  key={tanda.id} 
                  className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
                  onClick={() => handleEdit(tanda)}
                  style={{ borderColor: '#fce8e8' }}
                >
                  <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <div>
                        <CardTitle className="text-lg md:text-xl text-gray-800 mb-2">
                          {tanda.nombre}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {format(new Date(tanda.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                      </div>
                      <Badge className={`${estadoColors[tanda.estado]} border text-xs md:text-sm`}>
                        {tanda.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-4">
                      {tanda.hora && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{tanda.hora}</span>
                        </div>
                      )}
                      {tanda.lugar && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{tanda.lugar}</span>
                        </div>
                      )}
                      {tanda.numero_catadores && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{tanda.numero_catadores} catadores</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Wine className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{muestrasTanda.length} muestras</span>
                      </div>
                    </div>

                    {muestrasTanda.length > 0 && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#fce8e8' }}>
                        <p className="text-xs font-medium text-gray-500 mb-2">MUESTRAS INCLUIDAS:</p>
                        <div className="flex flex-wrap gap-2">
                          {muestrasTanda.map(m => (
                            <Badge key={m.id} variant="outline" className="bg-red-50 border-red-200 text-xs" style={{ color: '#390B0B' }}>
                              {m.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}