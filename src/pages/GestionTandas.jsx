import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, ChevronDown, Eye, X, Printer, CheckCircle, Wine } from 'lucide-react';

export default function GestionTandas() {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingSample, setViewingSample] = useState(null);
  const [selectedTanda, setSelectedTanda] = useState(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);

  const tandaOptions = Array.from({ length: 26 }, (_, i) => i + 1);
  const tandaOptionsRow1 = tandaOptions.slice(0, 13);
  const tandaOptionsRow2 = tandaOptions.slice(13, 26);

  const fetchSamples = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Iniciando carga de muestras...');
      const { data: samplesData, error } = await supabase
        .from('muestras')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Muestras cargadas:', samplesData?.length || 0, samplesData);
      setSamples(samplesData || []);

      const uniqueCategories = Array.from(
        new Set(samplesData?.map(s => s.categoria).filter(Boolean))
      ).sort();
      setAvailableCategories(uniqueCategories);
      console.log('📋 Categorías disponibles:', uniqueCategories);
    } catch (error) {
      console.error('❌ Error fetching samples:', error);
      setError(error.message || 'Error al cargar las muestras');
    } finally {
      setLoading(false);
      console.log('⏹️ Carga finalizada');
    }
  };

  const filterSamples = useCallback(() => {
    console.log('🔎 Filtrando muestras...', {
      totalSamples: samples.length,
      searchTerm,
      selectedCategories
    });
    
    let filtered = [...samples];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (sample) => sample.categoria && selectedCategories.includes(sample.categoria)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sample) =>
          sample.nombre.toLowerCase().includes(term) ||
          sample.codigo.toString().includes(term) ||
          sample.categoria?.toLowerCase().includes(term)
      );
    }

    console.log('✅ Muestras filtradas:', filtered.length);
    setFilteredSamples(filtered);
  }, [samples, selectedCategories, searchTerm]);

  useEffect(() => {
    fetchSamples();
  }, []);

  useEffect(() => {
    filterSamples();
  }, [filterSamples]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const updateTanda = async (sampleId, newTanda) => {
    setUpdatingId(sampleId);
    try {
      const { error } = await supabase
        .from('muestras')
        .update({ tanda: newTanda })
        .eq('id', sampleId);

      if (error) throw error;

      setSamples((prev) =>
        prev.map((sample) =>
          sample.id === sampleId ? { ...sample, tanda: newTanda || undefined } : sample
        )
      );
    } catch (error) {
      console.error('Error updating tanda:', error);
      alert('Error al actualizar la tanda');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrint = () => {
    setShowPrintPreview(false);
    setTimeout(() => {
      window.print();
      setShowSuccessModal(true);
    }, 100);
  };

  const getSamplesByTanda = (tandaNumber) => {
    return samples.filter(s => s.tanda === tandaNumber).sort((a, b) => a.codigo - b.codigo);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Cargando muestras...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error al cargar datos</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchSamples}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (samples.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <Wine className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay muestras registradas</h2>
          <p className="text-gray-600 mb-4">
            Aún no tienes muestras en la base de datos. Necesitas agregar muestras antes de poder asignar tandas.
          </p>
          <p className="text-sm text-gray-500">
            Ve a la sección de "Muestras" para agregar nuevas muestras al sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Tandas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrintPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              style={{ background: '#390A0B' }}
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Imprimir Tandas</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar por código, nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              style={{ outlineColor: '#390A0B' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Categorías {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-10 mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                <div className="p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 uppercase">Filtrar por categoría</span>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-xs font-medium hover:opacity-70"
                        style={{ color: '#390A0B' }}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  {availableCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 border-gray-300 rounded"
                        style={{ accentColor: '#390A0B' }}
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Mostrando {filteredSamples.length} de {samples.length} muestras
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ background: '#390A0B' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Muestra
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                  Tanda
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSamples.map((sample, index) => (
                <tr
                  key={sample.id}
                  onClick={() => setViewingSample(sample)}
                  className={`cursor-pointer ${index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-bold text-gray-900">{sample.codigo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base font-semibold text-gray-900">{sample.nombre}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{sample.categoria || '-'}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1 items-center">
                      <div className="flex gap-1 justify-center">
                        {tandaOptionsRow1.map((tanda) => (
                          <button
                            key={tanda}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTanda(sample.id, sample.tanda === tanda ? null : tanda);
                            }}
                            disabled={updatingId === sample.id}
                            className={`w-8 h-8 rounded-full font-bold text-xs transition-all border-2 ${
                              sample.tanda === tanda
                                ? 'text-white scale-110 shadow-lg'
                                : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                            } ${
                              updatingId === sample.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            style={sample.tanda === tanda ? { background: '#390A0B', borderColor: '#390A0B' } : {}}
                            title={`Tanda ${tanda}`}
                          >
                            {tanda}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1 justify-center">
                        {tandaOptionsRow2.map((tanda) => (
                          <button
                            key={tanda}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTanda(sample.id, sample.tanda === tanda ? null : tanda);
                            }}
                            disabled={updatingId === sample.id}
                            className={`w-8 h-8 rounded-full font-bold text-xs transition-all border-2 ${
                              sample.tanda === tanda
                                ? 'text-white scale-110 shadow-lg'
                                : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                            } ${
                              updatingId === sample.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            style={sample.tanda === tanda ? { background: '#390A0B', borderColor: '#390A0B' } : {}}
                            title={`Tanda ${tanda}`}
                          >
                            {tanda}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingSample(sample);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      style={{ color: '#390A0B' }}
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden">
          {filteredSamples.map((sample, index) => (
            <div
              key={sample.id}
              onClick={() => setViewingSample(sample)}
              className={`border-b border-gray-200 p-4 cursor-pointer ${
                index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-bold text-gray-900">#{sample.codigo}</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">{sample.nombre}</div>
                  <div className="text-xs text-gray-600 mt-1">{sample.categoria || '-'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {sample.tanda && (
                    <div className="px-3 py-1 text-white rounded-full text-sm font-bold" style={{ background: '#390A0B' }}>
                      Tanda {sample.tanda}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingSample(sample);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    style={{ color: '#390A0B' }}
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Seleccionar Tanda:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {tandaOptions.map((tanda) => (
                    <button
                      key={tanda}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTanda(sample.id, sample.tanda === tanda ? null : tanda);
                      }}
                      disabled={updatingId === sample.id}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all border-2 ${
                        sample.tanda === tanda
                          ? 'text-white scale-110 shadow-lg'
                          : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                      } ${
                        updatingId === sample.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={sample.tanda === tanda ? { background: '#390A0B', borderColor: '#390A0B' } : {}}
                      title={`Tanda ${tanda}`}
                    >
                      {tanda}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSamples.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron muestras
          </div>
        )}
      </div>

      {viewingSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Detalles de la Muestra</h3>
              <button
                onClick={() => setViewingSample(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Información Básica</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Código</label>
                  <p className="text-gray-900 font-mono text-lg">#{viewingSample.codigo}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900 font-medium">{viewingSample.nombre}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Empresa</label>
                  <p className="text-gray-900">{viewingSample.empresa || 'No especificada'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Categoría</label>
                  <p className="text-gray-900">{viewingSample.categoria || 'Sin categoría'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Tanda Asignada</label>
                  {viewingSample.tanda ? (
                    <div className="px-3 py-1 text-white rounded-full text-sm font-bold inline-block" style={{ background: '#390A0B' }}>
                      Tanda {viewingSample.tanda}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Sin tanda asignada</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Información Técnica</h4>
                
                {viewingSample.pais && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">País</label>
                    <p className="text-gray-900">{viewingSample.pais}</p>
                  </div>
                )}

                {viewingSample.origen && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Origen</label>
                    <p className="text-gray-900">{viewingSample.origen}</p>
                  </div>
                )}

                {viewingSample.año && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Año</label>
                    <p className="text-gray-900">{viewingSample.año}</p>
                  </div>
                )}

                {viewingSample.grado && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Grado Alcohólico</label>
                    <p className="text-gray-900">{viewingSample.grado}°</p>
                  </div>
                )}

                {viewingSample.tipouva && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipo de Uva</label>
                    <p className="text-gray-900">{viewingSample.tipouva}</p>
                  </div>
                )}

                {viewingSample.tipoaceituna && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipo de Aceituna</label>
                    <p className="text-gray-900">{viewingSample.tipoaceituna}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() => setViewingSample(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Seleccionar Tanda para Imprimir</h3>
              <button
                onClick={() => {
                  setShowPrintPreview(false);
                  setSelectedTanda(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
              {tandaOptions.map((tanda) => {
                const count = getSamplesByTanda(tanda).length;
                return (
                  <button
                    key={tanda}
                    onClick={() => setSelectedTanda(tanda)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTanda === tanda
                        ? 'text-white shadow-lg scale-105'
                        : count > 0
                        ? 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}
                    style={selectedTanda === tanda ? { background: '#390A0B', borderColor: '#390A0B' } : {}}
                  >
                    <div className="text-lg font-bold">{tanda}</div>
                    <div className="text-xs">{count} muestras</div>
                  </button>
                );
              })}
            </div>

            {selectedTanda && (
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Tanda {selectedTanda} - {getSamplesByTanda(selectedTanda).length} muestras
                  </h4>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ background: '#390A0B' }}
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                </div>

                <div className="print-content">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2" style={{ color: '#390A0B' }}>VIRTUS</h1>
                    <h2 className="text-lg font-semibold text-gray-700">Tanda {selectedTanda}</h2>
                  </div>

                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr style={{ background: '#390A0B' }}>
                        <th className="border border-gray-300 px-4 py-2 text-white text-left">Código</th>
                        <th className="border border-gray-300 px-4 py-2 text-white text-left">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-white text-left">Categoría</th>
                        <th className="border border-gray-300 px-4 py-2 text-white text-left">País</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSamplesByTanda(selectedTanda).map((sample, idx) => (
                        <tr key={sample.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2 font-bold">{sample.codigo}</td>
                          <td className="border border-gray-300 px-4 py-2">{sample.nombre}</td>
                          <td className="border border-gray-300 px-4 py-2">{sample.categoria || '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{sample.pais || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#390A0B' }} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Impresión exitosa!</h3>
            <p className="text-gray-600 mb-6">
              La tanda {selectedTanda} se ha enviado a imprimir correctamente
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedTanda(null);
              }}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ background: '#390A0B' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
