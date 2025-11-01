import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, Filter, Wine, MapPin, Calendar, Trash2, Eye, X } from 'lucide-react';

export default function Muestras() {
  const [muestras, setMuestras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewingSample, setViewingSample] = useState(null);

  useEffect(() => {
    fetchMuestras();
  }, []);

  const fetchMuestras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('muestras')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) throw error;
      setMuestras(data || []);
    } catch (error) {
      console.error('Error al cargar muestras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSample = async (muestra) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la muestra "${muestra.nombre}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('muestras')
        .delete()
        .eq('id', muestra.id);

      if (error) throw error;
      await fetchMuestras();
    } catch (error) {
      console.error('Error al eliminar muestra:', error);
      alert('Error al eliminar la muestra');
    }
  };

  const categorias = useMemo(() => {
    const cats = new Set(muestras.map(m => m.categoria).filter(Boolean));
    return Array.from(cats).sort();
  }, [muestras]);

  const filteredAndSortedMuestras = useMemo(() => {
    let filtered = muestras;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.nombre?.toLowerCase().includes(term) ||
        m.codigo?.toString().includes(term) ||
        m.empresa?.toLowerCase().includes(term) ||
        m.categoria?.toLowerCase().includes(term) ||
        m.pais?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(m => m.categoria === categoryFilter);
    }

    return filtered;
  }, [muestras, searchTerm, categoryFilter]);

  const getCategoryColor = (categoria) => {
    if (!categoria) return 'bg-gray-100 text-gray-700';
    const cat = categoria.toLowerCase();
    if (cat.includes('blanco')) return 'bg-yellow-100 text-yellow-800';
    if (cat.includes('tinto')) return 'bg-red-100 text-red-800';
    if (cat.includes('rosado')) return 'bg-pink-100 text-pink-800';
    if (cat.includes('espumoso')) return 'bg-blue-100 text-blue-800';
    if (cat.includes('aceite')) return 'bg-green-100 text-green-800';
    return 'bg-purple-100 text-purple-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando muestras...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: 'linear-gradient(to bottom, #fef5f5, #ffffff)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#390A0B' }}>
            Gestión de Muestras
          </h1>
          <p className="text-gray-600">
            Administra y visualiza todas las muestras registradas
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por código, nombre, empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#390A0B] focus:border-transparent"
              />
            </div>

            <div className="relative w-full md:w-64">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#390A0B] focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredAndSortedMuestras.length} de {muestras.length} muestras
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedMuestras.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No se encontraron muestras</p>
            </div>
          ) : (
            filteredAndSortedMuestras.map((muestra) => (
              <div
                key={muestra.id}
                className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#390A0B] to-[#5a1616]">
                      <Wine className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">#{muestra.codigo}</span>
                        <h3 className="text-xl font-bold text-gray-900">{muestra.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(muestra.categoria)}`}>
                          {muestra.categoria || 'Sin categoría'}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                        {muestra.pais && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{muestra.pais}</span>
                          </div>
                        )}
                        {muestra.año && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{muestra.año}</span>
                          </div>
                        )}
                        {muestra.empresa && (
                          <span className="text-gray-700">{muestra.empresa}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingSample(muestra)}
                      className="p-2 text-[#390A0B] hover:bg-red-50 rounded-lg"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSample(muestra)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {viewingSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Detalles de la Muestra</h3>
              <button onClick={() => setViewingSample(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Código</label>
                  <p className="text-lg font-mono">#{viewingSample.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="font-medium">{viewingSample.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Empresa</label>
                  <p>{viewingSample.empresa || '-'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">País</label>
                  <p>{viewingSample.pais || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Año</label>
                  <p>{viewingSample.año || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoría</label>
                  <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(viewingSample.categoria)}`}>
                    {viewingSample.categoria || '-'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setViewingSample(null)}
              className="w-full mt-6 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
