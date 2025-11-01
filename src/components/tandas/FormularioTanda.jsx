import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Save } from "lucide-react";

export default function FormularioTanda({ tanda, muestras, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(tanda || {
    nombre: "",
    fecha: "",
    hora: "",
    lugar: "",
    estado: "Programada",
    muestras_ids: [],
    numero_catadores: 1,
    notas: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleMuestra = (muestraId) => {
    const currentIds = formData.muestras_ids || [];
    if (currentIds.includes(muestraId)) {
      setFormData({
        ...formData,
        muestras_ids: currentIds.filter(id => id !== muestraId)
      });
    } else {
      setFormData({
        ...formData,
        muestras_ids: [...currentIds, muestraId]
      });
    }
  };

  return (
    <Card className="shadow-lg bg-white" style={{ borderColor: '#fce8e8' }}>
      <CardHeader className="border-b bg-gradient-to-r from-red-50/50 to-white p-4 md:p-6" style={{ borderColor: '#fce8e8' }}>
        <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
          {tanda ? 'Editar Tanda' : 'Nueva Tanda de Cata'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Tanda *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Cata de Tintos Reserva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input
                id="lugar"
                value={formData.lugar}
                onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                placeholder="Sala de catas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programada">Programada</SelectItem>
                  <SelectItem value="En Curso">En Curso</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_catadores">Número de Catadores</Label>
              <Input
                id="numero_catadores"
                type="number"
                min="1"
                value={formData.numero_catadores}
                onChange={(e) => setFormData({ ...formData, numero_catadores: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Muestras a Incluir</Label>
            <div className="border rounded-lg p-3 md:p-4 max-h-64 overflow-y-auto bg-red-50/30" style={{ borderColor: '#fce8e8' }}>
              {muestras.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay muestras disponibles
                </p>
              ) : (
                <div className="space-y-2">
                  {muestras.map(muestra => (
                    <div key={muestra.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded transition-colors">
                      <Checkbox
                        id={muestra.id}
                        checked={formData.muestras_ids?.includes(muestra.id)}
                        onCheckedChange={() => toggleMuestra(muestra.id)}
                      />
                      <label
                        htmlFor={muestra.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {muestra.nombre} {muestra.bodega && `- ${muestra.bodega}`} ({muestra.tipo})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas adicionales sobre la tanda..."
              rows={4}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto text-white"
              style={{ background: '#390B0B' }}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Tanda'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}