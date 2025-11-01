
import React, { useState, useEffect } from "react";
import { CataEspirituoso, Muestra, User } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";

export default function CataEspirituosos() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    User.getUser().then(setUser).catch(() => {});
  }, []);

  const { data: muestras } = useQuery({
    queryKey: ['muestras'],
    queryFn: () => Muestra.list(),
    initialData: []
  });

  const [formData, setFormData] = useState({
    muestra_id: "",
    tanda_id: "",
    codigo: "",
    catador_numero: 115,
    orden: 1,
    vista_limpidez: 0,
    vista_color: 0,
    olfato_intensidad: 0,
    olfato_limpidez: 0,
    olfato_calidad: 0,
    sabor_tipicidad: 0,
    sabor_persistencia: 0,
    sabor_calidad: 0,
    juicio_global: 0,
    puntuacion_total: 0,
    descartado: false
  });

  useEffect(() => {
    const total =
    formData.vista_limpidez +
    formData.vista_color +
    formData.olfato_intensidad +
    formData.olfato_limpidez +
    formData.olfato_calidad +
    formData.sabor_tipicidad +
    formData.sabor_persistencia +
    formData.sabor_calidad +
    formData.juicio_global;

    setFormData((prev) => ({ ...prev, puntuacion_total: total }));
  }, [
  formData.vista_limpidez, formData.vista_color,
  formData.olfato_intensidad, formData.olfato_limpidez, formData.olfato_calidad,
  formData.sabor_tipicidad, formData.sabor_persistencia, formData.sabor_calidad,
  formData.juicio_global]
  );

  const createMutation = useMutation({
    mutationFn: (data) => CataEspirituoso.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catasEspirituosos'] });
      resetForm();
      setFormData((prev) => ({ ...prev, orden: prev.orden + 1 }));
    }
  });

  const handleSubmit = (descartado = false) => {
    createMutation.mutate({ ...formData, descartado });
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      vista_limpidez: 0,
      vista_color: 0,
      olfato_intensidad: 0,
      olfato_limpidez: 0,
      olfato_calidad: 0,
      sabor_tipicidad: 0,
      sabor_persistencia: 0,
      sabor_calidad: 0,
      juicio_global: 0,
      puntuacion_total: 0,
      descartado: false
    }));
  };

  const getCalificacion = (puntos) => {
    if (puntos >= 94) return { text: "GRAN ORO 94-100", color: "#FFD700" };
    if (puntos >= 90) return { text: "90-93 ORO", color: "#FFD700" };
    if (puntos >= 87) return { text: "87-89 PLATA", color: "#C0C0C0" };
    return { text: "", color: "#000" };
  };

  const calificacion = getCalificacion(formData.puntuacion_total);

  const ScoreButton = ({ value, selected, onClick, disabled }) =>
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-12 h-10 rounded-lg font-bold text-sm transition-all duration-150"
    style={{
      backgroundColor: disabled ? 'transparent' : selected ? '#DC2626' : '#000000',
      color: disabled ? 'transparent' : 'white',
      border: disabled ? 'none' : 'none',
      cursor: disabled ? 'default' : 'pointer'
    }}>
      {value}
    </button>;

  const ScoreRow = ({ label, value, options, field, showTitle = false, title = "" }) =>
  <div className="flex gap-2 items-center mb-1">
      {showTitle && (
        <div className="px-3 py-1 font-bold text-base text-left" style={{ minWidth: '80px', color: '#000000' }}>
          {title}
        </div>
      )}
      <div className="flex gap-2 items-center flex-1 justify-end">
        <div className="px-3 py-1 rounded-l-lg font-medium text-right text-sm" style={{ backgroundColor: 'transparent', minWidth: '160px' }}>
          {label}
        </div>
        <div className="flex items-center justify-center">
          <div className="w-9 h-9 rounded-md border-2 border-gray-400 flex items-center justify-center font-bold text-sm text-gray-700">
            {formData[field]}
          </div>
        </div>
        <div className="flex gap-1">
          {options.map((val, idx) =>
        <ScoreButton
          key={idx}
          value={val}
          selected={formData[field] === val}
          onClick={() => val !== null && setFormData({ ...formData, [field]: val })}
          disabled={val === null} />
        )}
        </div>
      </div>
    </div>;

  return (
    <div className="min-h-screen p-3 flex justify-start" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="flex-1 max-w-4xl mr-4">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-3">
          {/* Header dentro del formulario */}
          <div className="mb-3 text-right">
            <div className="flex gap-2 text-xs justify-end items-center">
              {calificacion.text &&
              <span style={{ color: calificacion.color }} className="font-semibold">
                  {calificacion.text}
                </span>
              }
              <span className="text-green-600 font-semibold">Excelente</span>
              <span className="text-blue-600 font-semibold">Muy Bueno</span>
              <span className="text-yellow-600 font-semibold">Bueno</span>
              <span className="text-orange-600 font-semibold">Regular</span>
              <span className="text-red-600 font-semibold">Insuficiente</span>
            </div>
          </div>

          {/* Vista */}
          <div className="mb-2 p-2 rounded-lg" style={{ backgroundColor: '#FFF9E6' }}>
            <ScoreRow
              label="Limpidez"
              value={formData.vista_limpidez}
              options={[5, null, null, null, 1]}
              field="vista_limpidez"
              showTitle={true}
              title="Vista" />
            <ScoreRow
              label="Color"
              value={formData.vista_color}
              options={[5, 4, 3, 2, 1]}
              field="vista_color" />
          </div>

          {/* Olfato / Olor */}
          <div className="mb-2 p-2 rounded-lg" style={{ backgroundColor: '#FFE8E8' }}>
            <ScoreRow
              label="Intensidad positiva"
              value={formData.olfato_intensidad}
              options={[9, 7, 5, 3, 1]}
              field="olfato_intensidad"
              showTitle={true}
              title="Olfato / Olor" />
            <ScoreRow
              label="Limpidez"
              value={formData.olfato_limpidez}
              options={[6, 5, 4, 3, 2]}
              field="olfato_limpidez" />
            <ScoreRow
              label="Calidad"
              value={formData.olfato_calidad}
              options={[15, 13, 11, 9, 7]}
              field="olfato_calidad" />
          </div>

          {/* Sabor */}
          <div className="mb-2 p-2 rounded-lg" style={{ backgroundColor: '#F5E6FF' }}>
            <ScoreRow
              label="Tipicidad"
              value={formData.sabor_tipicidad}
              options={[8, 7, 6, 5, 4]}
              field="sabor_tipicidad"
              showTitle={true}
              title="Sabor" />
            <ScoreRow
              label="Persistencia Aromática"
              value={formData.sabor_persistencia}
              options={[12, 10, 8, 6, 4]}
              field="sabor_persistencia" />
            <ScoreRow
              label="Calidad"
              value={formData.sabor_calidad}
              options={[20, 18, 14, 10, 6]}
              field="sabor_calidad" />
          </div>

          {/* Juicio Global */}
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
            <ScoreRow
              label="Juicio Global"
              value={formData.juicio_global}
              options={[20, 18, 14, 10, 6]}
              field="juicio_global" />
          </div>
        </div>
      </div>

      {/* Barra Lateral Derecha */}
      <div className="w-48 space-y-3 self-start pt-2">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2 text-gray-800">Espirituosos / Generosos</h1>
          <p className="text-xs text-gray-600 mb-1">Código</p>
          <p className="text-3xl font-bold text-purple-900">{formData.codigo || '4975'}</p>
        </div>

        <div className="text-center p-3 border-4 rounded-xl bg-white" style={{ borderColor: '#000000' }}>
          <p className="text-xs text-gray-600 mb-1">Puntos</p>
          <p className="text-3xl font-bold" style={{ color: '#F44336' }}>
            {formData.puntuacion_total}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Orden</p>
          <p className="text-2xl font-bold text-gray-700">{formData.orden}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Nº Catador</p>
          <p className="text-2xl font-bold text-gray-700">{formData.catador_numero}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">Tanda {formData.tanda_id || '17'}</p>
        </div>

        <Button
          onClick={() => handleSubmit(false)}
          disabled={createMutation.isPending}
          className="w-full py-3 text-base font-bold"
          style={{ backgroundColor: '#1F2937', color: 'white' }}>
          ENVIAR
        </Button>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => handleSubmit(false)}
            disabled={createMutation.isPending}
            className="w-full py-2 text-xs rounded-full"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Siguiente
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={createMutation.isPending}
            className="w-full py-2 text-xs rounded-full"
            style={{ backgroundColor: '#F44336', color: 'white' }}>
            <X className="w-3 h-3 mr-1" />
            Desechar
          </Button>
          <Button
            onClick={resetForm}
            variant="ghost"
            className="w-full py-2 text-xs text-red-600 font-semibold">
            Reset
          </Button>
        </div>
      </div>
    </div>);
}
