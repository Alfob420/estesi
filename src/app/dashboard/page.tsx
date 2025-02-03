'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Auto, Consulta } from '@/types/types'
import AutoForm from '@/components/AutoForm'
import { 
  PlusIcon, 
  InboxIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline'
import OfertaDetalleModal from '@/components/OfertaDetalleModal'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('autos')
  const [autos, setAutos] = useState<Auto[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [showAutoForm, setShowAutoForm] = useState(false)
  const [editingAuto, setEditingAuto] = useState<Auto | null>(null)
  const [consultaTab, setConsultaTab] = useState<'pendientes' | 'respondidas'>('pendientes')
  const [tipoConsulta, setTipoConsulta] = useState<'todas' | 'consultas' | 'ventas'>('todas')
  const [selectedOferta, setSelectedOferta] = useState<Consulta | null>(null)

  useEffect(() => {
    checkAuth()
    fetchAutos()
    fetchConsultas()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/panel')
    } else {
      setLoading(false)
    }
  }

  const fetchAutos = async () => {
    const { data } = await supabase
      .from('autos')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAutos(data)
  }

  const fetchConsultas = async () => {
    try {
      // Obtener consultas de autos publicados
      const { data: consultasData, error: consultasError } = await supabase
        .from('consultas')
        .select(`
          *,
          auto:auto_id (
            id,
            marca,
            modelo,
            año,
            imagenes
          )
        `)
        .order('created_at', { ascending: false })

      // Obtener ofertas de venta
      const { data: ventasData, error: ventasError } = await supabase
        .from('ofertas_venta')
        .select('*')
        .order('created_at', { ascending: false })

      if (consultasError) throw consultasError
      if (ventasError) throw ventasError

      // Formatear los datos
      const consultasFormateadas = (consultasData || []).map(c => ({
        ...c,
        tipo: 'consulta',
        nombreCliente: c.nombre,
        autoInfo: c.auto
      }))

      const ventasFormateadas = (ventasData || []).map(v => ({
        ...v,
        tipo: 'venta'
      }))

      setConsultas([...consultasFormateadas, ...ventasFormateadas])
    } catch (error) {
      console.error('Error al cargar consultas:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/panel')
  }

  // Función para eliminar auto
  const handleDeleteAuto = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      try {
        const { error } = await supabase
          .from('autos')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Eliminar imágenes del storage
        const auto = autos.find(a => a.id === id)
        if (auto?.imagenes) {
          for (const imagen of auto.imagenes) {
            const imageName = imagen.split('/').pop()
            if (imageName) {
              await supabase.storage
                .from('autos-imagenes')
                .remove([imageName])
            }
          }
        }

        // Actualizar lista de autos
        fetchAutos()
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el auto')
      }
    }
  }

  // Función para marcar consulta como respondida
  const handleConsultaRespondida = async (id: string, tipo: 'consulta' | 'venta') => {
    try {
      let error;

      if (tipo === 'venta') {
        const { error: ventaError } = await supabase
          .from('ofertas_venta')
          .update({ estado: 'respondida' })
          .eq('id', id);
        error = ventaError;
      } else {
        const { error: consultaError } = await supabase
          .from('consultas')
          .update({ estado: 'respondida' })
          .eq('id', id);
        error = consultaError;
      }

      if (error) throw error;

      // Actualizar el estado local
      setConsultas(prevConsultas => 
        prevConsultas.map(consulta => 
          consulta.id === id 
            ? { ...consulta, estado: 'respondida' }
            : consulta
        )
      );

      // Opcional: Mostrar mensaje de éxito
      alert('Consulta marcada como respondida');

    } catch (error) {
      console.error('Error al actualizar consulta:', error);
      alert('Error al actualizar el estado de la consulta');
    }
  };

  // Función para eliminar consulta
  const handleDeleteConsulta = async (id: string, tipo: 'consulta' | 'venta') => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        const { error } = await supabase
          .from(tipo === 'venta' ? 'ofertas_venta' : 'consultas')
          .delete()
          .eq('id', id)

        if (error) throw error

        fetchConsultas()
      } catch (error) {
        console.error('Error al eliminar consulta:', error)
        alert('Error al eliminar la consulta')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008CBA]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('autos')}
              className={`${
                activeTab === 'autos'
                  ? 'border-[#008CBA] text-[#008CBA]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <TruckIcon className="h-5 w-5 mr-2" />
              Inventario de Autos
            </button>
            <button
              onClick={() => setActiveTab('consultas')}
              className={`${
                activeTab === 'consultas'
                  ? 'border-[#008CBA] text-[#008CBA]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <InboxIcon className="h-5 w-5 mr-2" />
              Consultas
              {consultas.filter(c => c.estado === 'pendiente').length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  {consultas.filter(c => c.estado === 'pendiente').length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'autos' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Inventario de Autos</h2>
                <button
                  onClick={() => setShowAutoForm(true)}
                  className="flex items-center px-4 py-2 bg-[#008CBA] text-white rounded-md hover:bg-[#007A9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008CBA]"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Agregar Auto
                </button>
              </div>
              
              {/* Tabla de autos */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {autos.map((auto) => (
                      <tr key={auto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={auto.imagenes[0]}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {auto.marca} {auto.modelo}
                              </div>
                              <div className="text-sm text-gray-500">
                                {auto.año} - {auto.kilometraje.toLocaleString()} km
                                {auto.caracteristicas.gnc && (
                                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    GNC
                                  </span>
                                )}
                                {auto.caracteristicas.vtv && (
                                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    VTV
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            USD {auto.precio.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            auto.estado === 'nuevo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {auto.estado.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => setEditingAuto(auto)}
                            className="text-[#008CBA] hover:text-[#007A9E] mr-3"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteAuto(auto.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Consultas y Ofertas</h2>
                <div className="flex space-x-4">
                  <select
                    value={tipoConsulta}
                    onChange={(e) => setTipoConsulta(e.target.value as 'todas' | 'consultas' | 'ventas')}
                    className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300"
                  >
                    <option value="todas">Todas</option>
                    <option value="consultas">Consultas</option>
                    <option value="ventas">Ofertas de Venta</option>
                  </select>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setConsultaTab('pendientes')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        consultaTab === 'pendientes'
                          ? 'bg-[#008CBA] text-white'
                          : 'text-gray-500 hover:text-gray-700 bg-white'
                      }`}
                    >
                      Pendientes
                      {consultas.filter(c => c.estado === 'pendiente').length > 0 && (
                        <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                          {consultas.filter(c => c.estado === 'pendiente').length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setConsultaTab('respondidas')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        consultaTab === 'respondidas'
                          ? 'bg-[#008CBA] text-white'
                          : 'text-gray-500 hover:text-gray-700 bg-white'
                      }`}
                    >
                      Respondidas
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-6">
                {consultas
                  .filter(c => 
                    // Filtrar por tipo de consulta (todas, consultas, ventas)
                    (tipoConsulta === 'todas' || c.tipo === tipoConsulta) &&
                    // Filtrar por estado (pendientes/respondidas)
                    c.estado === (consultaTab === 'pendientes' ? 'pendiente' : 'respondida')
                  )
                  .map((consulta) => (
                    <div key={consulta.id} className="bg-white p-4 rounded-lg shadow mb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={consulta.autoInfo?.imagenes?.[0] || consulta.auto?.imagenes[0] || '/placeholder.png'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {consulta.nombre}
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                consulta.tipo === 'venta'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {consulta.tipo === 'venta' ? 'Oferta de Venta' : 'Consulta de Auto'}
                              </span>
                            </p>
                            <div className="text-sm text-gray-500">
                              <p>Email: {consulta.email}</p>
                              <p>Teléfono: {consulta.telefono}</p>
                              {consulta.tipo === 'venta' ? (
                                consulta.autoInfo && (
                                  <p className="mt-1">
                                    Auto ofrecido: {consulta.autoInfo.marca} {consulta.autoInfo.modelo} {consulta.autoInfo.año}
                                    {consulta.autoInfo.kilometraje && ` - ${consulta.autoInfo.kilometraje.toLocaleString()} km`}
                                  </p>
                                )
                              ) : (
                                consulta.auto && (
                                  <p className="mt-1">
                                    Consulta sobre: {consulta.auto.marca} {consulta.auto.modelo} {consulta.auto.año}
                                  </p>
                                )
                              )}
                              <p className="mt-1 text-xs">
                                Fecha: {new Date(consulta.created_at).toLocaleDateString()}
                              </p>
                              <p className="mt-2 text-gray-700">{consulta.mensaje}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          {consulta.tipo === 'venta' && (
                            <button 
                              onClick={() => setSelectedOferta(consulta)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Ver detalles
                            </button>
                          )}
                          {consulta.estado === 'pendiente' && (
                            <button 
                              onClick={() => handleConsultaRespondida(consulta.id, consulta.tipo)}
                              className="text-green-600 hover:text-green-800"
                            >
                              Marcar como Respondida
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteConsulta(consulta.id, consulta.tipo)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {/* Mensaje cuando no hay consultas */}
                {consultas.filter(c => 
                  (tipoConsulta === 'todas' || c.tipo === tipoConsulta) &&
                  c.estado === (consultaTab === 'pendientes' ? 'pendiente' : 'respondida')
                ).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay consultas {consultaTab === 'pendientes' ? 'pendientes' : 'respondidas'}
                    {tipoConsulta !== 'todas' && ` de tipo ${tipoConsulta}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedOferta && (
        <OfertaDetalleModal
          oferta={selectedOferta}
          onClose={() => setSelectedOferta(null)}
        />
      )}
    </div>
  )
}