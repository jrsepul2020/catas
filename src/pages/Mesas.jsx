import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMesa, setEditingMesa] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    nombre: ''
  });

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .order('numero', { ascending: true });

      if (error) throw error;
      setMesas(data || []);
    } catch (error) {
      console.error('Error al cargar mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mesa = null) => {
    if (mesa) {
      setEditingMesa(mesa);
      setFormData({
        numero: mesa.numero,
        nombre: mesa.nombre || ''
      });
    } else {
      setEditingMesa(null);
      setFormData({
        numero: '',
        nombre: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMesa(null);
    setFormData({
      numero: '',
      nombre: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMesa) {
        const { error } = await supabase
          .from('mesas')
          .update({
            nombre: formData.nombre
          })
          .eq('id', editingMesa.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mesas')
          .insert([{
            numero: parseInt(formData.numero),
            nombre: formData.nombre
          }]);

        if (error) throw error;
      }

      await fetchMesas();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar mesa:', error);
      alert('Error al guardar la mesa: ' + error.message);
    }
  };

  const handleDelete = async (mesa) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la Mesa ${mesa.numero}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('mesas')
        .delete()
        .eq('id', mesa.id);

      if (error) throw error;
      await fetchMesas();
    } catch (error) {
      console.error('Error al eliminar mesa:', error);
      alert('Error al eliminar la mesa: ' + error.message);
    }
  };

  const filteredMesas = mesas.filter(mesa => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      mesa.numero.toString().includes(term) ||
      mesa.nombre?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Cargando mesas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Mesas</h2>
            <p className="text-sm text-gray-600 mt-1">Administra las mesas de cata</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
            style={{ background: '#390A0B' }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Nueva Mesa</span>
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar por número o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              style={{ outlineColor: '#390A0B' }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Mostrando {filteredMesas.length} de {mesas.length} mesas
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMesas.map((mesa) => (
          <div
            key={mesa.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-transparent"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: '#390A0B' }}
                >
                  {mesa.numero}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {mesa.nombre || `Mesa ${mesa.numero}`}
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleOpenModal(mesa)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(mesa)}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMesas.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron mesas</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ background: '#390A0B' }}
          >
            Crear primera mesa
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingMesa ? 'Editar Mesa' : 'Nueva Mesa'}
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
                  Número de Mesa *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  disabled={editingMesa !== null}
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ outlineColor: '#390A0B' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Mesa Principal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: '#390A0B' }}
                />
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
                  {editingMesa ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
