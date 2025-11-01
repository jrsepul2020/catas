import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, UserCheck, Plus, Edit, Trash2, X, Save, Mail, Phone } from 'lucide-react';

export default function Catadores() {
  const [catadores, setCatadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCatador, setEditingCatador] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    activo: true
  });

  useEffect(() => {
    fetchCatadores();
  }, []);

  const fetchCatadores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('catadores')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setCatadores(data || []);
    } catch (error) {
      console.error('Error al cargar catadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (catador = null) => {
    if (catador) {
      setEditingCatador(catador);
      setFormData({
        nombre: catador.nombre || '',
        email: catador.email || '',
        telefono: catador.telefono || '',
        especialidad: catador.especialidad || '',
        activo: catador.activo !== false
      });
    } else {
      setEditingCatador(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        especialidad: '',
        activo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCatador(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      especialidad: '',
      activo: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCatador) {
        const { error } = await supabase
          .from('catadores')
          .update({
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            especialidad: formData.especialidad,
            activo: formData.activo
          })
          .eq('id', editingCatador.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('catadores')
          .insert([{
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            especialidad: formData.especialidad,
            activo: formData.activo
          }]);

        if (error) throw error;
      }

      await fetchCatadores();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar catador:', error);
      alert('Error al guardar el catador: ' + error.message);
    }
  };

  const handleDelete = async (catador) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${catador.nombre}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('catadores')
        .delete()
        .eq('id', catador.id);

      if (error) throw error;
      await fetchCatadores();
    } catch (error) {
      console.error('Error al eliminar catador:', error);
      alert('Error al eliminar el catador: ' + error.message);
    }
  };

  const filteredCatadores = catadores.filter(catador => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      catador.nombre?.toLowerCase().includes(term) ||
      catador.email?.toLowerCase().includes(term) ||
      catador.especialidad?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Cargando catadores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Catadores</h2>
            <p className="text-sm text-gray-600 mt-1">Administra los catadores y evaluadores</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
            style={{ background: '#390A0B' }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Nuevo Catador</span>
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              style={{ outlineColor: '#390A0B' }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Mostrando {filteredCatadores.length} de {catadores.length} catadores
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCatadores.map((catador) => (
          <div
            key={catador.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 ${
              catador.activo ? 'border-transparent' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: catador.activo ? '#390A0B' : '#999' }}
                >
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {catador.nombre}
                  </h3>
                  {!catador.activo && (
                    <span className="text-xs text-gray-500 italic">Inactivo</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {catador.email && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{catador.email}</span>
                </div>
              )}
              {catador.telefono && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{catador.telefono}</span>
                </div>
              )}
              {catador.especialidad && (
                <div className="text-sm text-gray-600">
                  🎯 {catador.especialidad}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleOpenModal(catador)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(catador)}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCatadores.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron catadores</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ background: '#390A0B' }}
          >
            Crear primer catador
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCatador ? 'Editar Catador' : 'Nuevo Catador'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez García"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: '#390A0B' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: '#390A0B' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+34 600 000 000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: '#390A0B' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                  placeholder="Ej: Vinos Tintos, Aceites, Espirituosos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: '#390A0B' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#390A0B' }}
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Catador activo
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                  style={{ background: '#390A0B' }}
                >
                  <Save className="w-4 h-4" />
                  {editingCatador ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
