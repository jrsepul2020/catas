import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../api/supabaseClient';
import { Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, Crown, Edit, Trash2, X, Save } from 'lucide-react';

// Página Catadores vinculada a la tabla 'usuarios'
export default function Catadores() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [mesaFilter, setMesaFilter] = useState('');
  const [sortField, setSortField] = useState('mesa');
  const [sortAsc, setSortAsc] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: '', mesa: '', puesto: '', ntablet: '' });

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, codigocatador, nombre, rol, mesa, puesto, ntablet, email')
          .order('mesa', { ascending: true });
        if (error) throw error;
        setUsuarios(data || []);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const roles = useMemo(() => {
    const set = new Set(usuarios.map(u => u.rol).filter(Boolean));
    // Ensure common roles are available
    ['Presidente', 'Catador', 'Secretario'].forEach(r => set.add(r));
    return Array.from(set).sort();
  }, [usuarios]);

  const mesas = useMemo(() => {
    return Array.from(new Set(usuarios.map(u => u.mesa).filter(m => m !== null && m !== undefined))).sort((a,b)=>a-b);
  }, [usuarios]);

  const processed = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = usuarios.filter(u => {
      const matchesSearch = !term ||
        u.nombre?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        String(u.mesa ?? '').includes(term) ||
        String(u.puesto ?? '').includes(term) ||
        String(u.ntablet ?? '').includes(term) ||
        u.rol?.toLowerCase().includes(term);
      const matchesRole = !roleFilter || u.rol === roleFilter;
      const matchesMesa = !mesaFilter || String(u.mesa) === String(mesaFilter);
      return matchesSearch && matchesRole && matchesMesa;
    });

    // Secondary sort to keep deterministic ordering
    list.sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      const A = a[sortField];
      const B = b[sortField];
      // Numeric vs string compare
      if (A == null && B != null) return -1 * dir;
      if (A != null && B == null) return 1 * dir;
      if (A == null && B == null) return 0;
      if (typeof A === 'number' && typeof B === 'number') return (A - B) * dir;
      return String(A).localeCompare(String(B)) * dir;
    });

    // Stable tiebreakers: mesa asc, puesto asc, nombre asc
    list.sort((a, b) => {
      const t1 = (a.mesa ?? 0) - (b.mesa ?? 0);
      if (t1 !== 0) return t1;
      const t2 = (a.puesto ?? 0) - (b.puesto ?? 0);
      if (t2 !== 0) return t2;
      return String(a.nombre || '').localeCompare(String(b.nombre || ''));
    });

    return list;
  }, [usuarios, search, roleFilter, mesaFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const updateUsuario = async (id, patch) => {
    setSavingId(id);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(patch)
        .eq('id', id);
      if (error) throw error;
      setUsuarios(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      alert('No se pudo guardar los cambios');
    } finally {
      setSavingId(null);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user?.nombre || '',
      email: user?.email || '',
      rol: user?.rol || '',
      mesa: user?.mesa ?? '',
      puesto: user?.puesto ?? '',
      ntablet: user?.ntablet ?? ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const submitModal = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const patch = {
      nombre: formData.nombre || null,
      email: formData.email || null,
      rol: formData.rol || null,
      mesa: formData.mesa === '' ? null : Number(formData.mesa),
      puesto: formData.puesto === '' ? null : Number(formData.puesto),
      ntablet: formData.ntablet === '' ? null : Number(formData.ntablet)
    };
    await updateUsuario(editingUser.id, patch);
    closeModal();
  };

  const handleDelete = async (user) => {
    if (!confirm(`¿Eliminar a "${user.nombre || user.email}"?`)) return;
    try {
      const { error } = await supabase.from('usuarios').delete().eq('id', user.id);
      if (error) throw error;
      setUsuarios(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      alert('No se pudo eliminar');
    }
  };

  const mesaColorClass = (mesa) => {
    const map = {
      1: 'bg-rose-200',
      2: 'bg-purple-200',
      3: 'bg-blue-200',
      4: 'bg-green-200',
      5: 'bg-yellow-200',
      6: 'bg-teal-200',
      7: 'bg-orange-200',
      8: 'bg-indigo-200',
      9: 'bg-cyan-200',
      10: 'bg-lime-200',
    };
    return map[mesa] || 'bg-gray-100';
  };

  // eslint-disable-next-line react/prop-types
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-4 h-4 inline-block ml-1 text-gray-400" />;
    return sortAsc ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1 text-gray-600" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1 text-gray-600" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Cargando catadores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pr-4 pb-4 pl-4 md:pt-6 md:pr-6 md:pb-6 md:pl-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-8" style={{ background: '#F7F7F2' }}>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Catadores</h1>
            <p className="text-sm text-gray-600">Asociado a la tabla usuarios</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, rol, mesa…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ outlineColor: '#390A0B' }}
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Todos los roles</option>
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-40">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={mesaFilter}
                onChange={(e) => setMesaFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Todas las mesas</option>
                {mesas.map(n => (
                  <option key={n} value={n}>Mesa {n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">Mostrando {processed.length} de {usuarios.length} usuarios</div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ background: '#390A0B' }}>
            <tr>
              <th className="px-2 py-2 text-center text-sm font-semibold text-white" style={{ width: '4rem' }}>
                Cód
              </th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-white cursor-pointer" onClick={() => toggleSort('nombre')}>
                Nombre <SortIcon field="nombre" />
              </th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-white cursor-pointer" onClick={() => toggleSort('rol')}>
                Rol <SortIcon field="rol" />
              </th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-white cursor-pointer" onClick={() => toggleSort('mesa')}>
                Mesa <SortIcon field="mesa" />
              </th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-white cursor-pointer" onClick={() => toggleSort('puesto')}>
                Puesto <SortIcon field="puesto" />
              </th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-white cursor-pointer" onClick={() => toggleSort('ntablet')}>
                Tablet <SortIcon field="ntablet" />
              </th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processed.map((u, idx) => (
              <tr key={u.id ?? idx} className={`${mesaColorClass(u.mesa)} ${idx % 2 === 0 ? '' : 'bg-opacity-60'}`}>
                <td className="px-2 py-2 text-center text-sm font-mono font-semibold" style={{ width: '4rem' }}>
                  {u.codigocatador || '-'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {String(u.rol || '').toLowerCase().includes('president') && (
                      <Crown className="w-4 h-4 text-yellow-600" />
                    )}
                    <div className="font-semibold text-gray-900">{u.nombre || '-'} </div>
                    {u.email && (
                      <div className="text-xs text-gray-600">({u.email})</div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={u.rol || ''}
                    onChange={(e) => updateUsuario(u.id, { rol: e.target.value || null })}
                    className="w-full max-w-[180px] px-2 py-1 border border-gray-300 rounded-md bg-white text-sm"
                    disabled={savingId === u.id}
                  >
                    <option value="">-</option>
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={u.mesa ?? ''}
                    onChange={(e) => updateUsuario(u.id, { mesa: e.target.value === '' ? null : Number(e.target.value) })}
                    className="px-2 py-1 border border-gray-300 rounded-md bg-white text-sm"
                    disabled={savingId === u.id}
                  >
                    <option value="">-</option>
                    {mesas.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    {/* Allow quickly setting values beyond detected mesas */}
                    {[...Array(10)].map((_,i)=>{
                      const val=i+1;
                      return mesas.includes(val)?null:<option key={`extra-mesa-${val}`} value={val}>{val}</option>
                    })}
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={u.puesto ?? ''}
                    onChange={(e) => updateUsuario(u.id, { puesto: e.target.value === '' ? null : Number(e.target.value) })}
                    className="px-2 py-1 border border-gray-300 rounded-md bg-white text-sm"
                    disabled={savingId === u.id}
                  >
                    <option value="">-</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    value={u.ntablet ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, ntablet: v === '' ? '' : Number(v) } : x));
                    }}
                    onBlur={(e) => {
                      const v = e.target.value;
                      updateUsuario(u.id, { ntablet: v === '' ? null : Number(v) });
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={savingId === u.id}
                    min={0}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-2 rounded hover:bg-gray-100"
                      title="Editar"
                      style={{ color: '#390A0B' }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-2 rounded hover:bg-red-50 text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {processed.length === 0 && (
              <tr>
                <td colSpan="7" className="px-3 py-6 text-center text-gray-500">No se encontraron resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">Editar Catador</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitModal} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="">-</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mesa</label>
                  <input
                    type="number"
                    value={formData.mesa}
                    onChange={(e) => setFormData({ ...formData, mesa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Puesto</label>
                  <input
                    type="number"
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tablet</label>
                  <input
                    type="number"
                    value={formData.ntablet}
                    onChange={(e) => setFormData({ ...formData, ntablet: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white rounded-md flex items-center gap-2" style={{ background: '#390A0B' }}>
                  <Save className="w-4 h-4" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
