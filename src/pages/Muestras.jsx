import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function Muestras() {
  const [muestras, setMuestras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchMuestras();
  }, []);

  const fetchMuestras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('muestras')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setMuestras(data || []);
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(data?.map(m => m.categoria).filter(Boolean))];
      setCategorias(uniqueCategories);
    } catch (error) {
      console.error('Error al cargar muestras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedMuestras = React.useMemo(() => {
    let filtered = [...muestras];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoría
    if (categoriaFilter) {
      filtered = filtered.filter(m => m.categoria === categoriaFilter);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Convertir a string si es null/undefined
      aVal = aVal ?? '';
      bVal = bVal ?? '';

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' 
        ? aVal - bVal
        : bVal - aVal;
    });

    return filtered;
  }, [muestras, searchTerm, categoriaFilter, sortField, sortDirection]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortDirection === 'asc' ? 'text-red-600' : 'text-red-600 rotate-180'}`} 
      />
    );
  };

  if (loading) {
    return (
      <div className="pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8" 
        style={{ backgroundColor: '#fff5f5' }}>
        <div className="max-w-[98rem] mr-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-600">Cargando muestras...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8" 
      style={{ backgroundColor: '#fff5f5' }}>
      <div className="max-w-[98rem] mr-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#390A0B' }}>
            Gestión de Muestras
          </h1>
          <p className="text-gray-600">
            Total: {filteredAndSortedMuestras.length} de {muestras.length} muestras
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de categoría */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || categoriaFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoriaFilter('');
              }}
              className="mt-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#390A0B' }}>
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-90"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      ID <SortIcon field="id" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-90"
                    onClick={() => handleSort('codigo')}
                  >
                    <div className="flex items-center gap-2">
                      Código <SortIcon field="codigo" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-90"
                    onClick={() => handleSort('nombre')}
                  >
                    <div className="flex items-center gap-2">
                      Nombre <SortIcon field="nombre" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-90"
                    onClick={() => handleSort('categoria')}
                  >
                    <div className="flex items-center gap-2">
                      Categoría <SortIcon field="categoria" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Descripción
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-opacity-90"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Fecha <SortIcon field="created_at" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedMuestras.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      {searchTerm || categoriaFilter 
                        ? 'No se encontraron muestras con los filtros aplicados'
                        : 'No hay muestras registradas'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedMuestras.map((muestra, index) => (
                    <tr 
                      key={muestra.id}
                      className={`hover:bg-red-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {muestra.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {muestra.codigo || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {muestra.nombre || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: 'rgba(57,10,11,0.1)', 
                            color: '#390A0B' 
                          }}
                        >
                          {muestra.categoria || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {muestra.descripcion || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {muestra.created_at 
                          ? new Date(muestra.created_at).toLocaleDateString('es-ES')
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
