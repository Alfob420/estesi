'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import AdminVehicleForm from '@/components/AdminVehicleForm'
import { Auto } from '@/types/types'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const router = useRouter()
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAuto, setEditingAuto] = useState<Auto | null>(null)

  useEffect(() => {
    checkAuth()
    fetchAutos()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    }
  }

  const fetchAutos = async () => {
    const { data, error } = await supabase
      .from('autos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error:', error)
    } else {
      setAutos(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      const { error } = await supabase
        .from('autos')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Error al eliminar el vehículo')
      } else {
        fetchAutos()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={() => {
                setEditingAuto(null)
                setIsFormOpen(true)
              }}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Agregar Vehículo
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008CBA]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Imagen</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Marca/Modelo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Año</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {autos.map((auto) => (
                    <tr key={auto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={auto.imagenes[0]}
                          alt={`${auto.marca} ${auto.modelo}`}
                          className="h-16 w-24 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{auto.marca}</div>
                        <div className="text-gray-500">{auto.modelo}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{auto.año}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        USD {auto.precio.toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${auto.estado === 'nuevo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {auto.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingAuto(auto)
                              setIsFormOpen(true)
                            }}
                            className="p-1 text-gray-500 hover:text-[#008CBA] transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(auto.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <AdminVehicleForm
          auto={editingAuto}
          onClose={() => {
            setIsFormOpen(false)
            setEditingAuto(null)
          }}
          onSuccess={() => {
            setIsFormOpen(false)
            setEditingAuto(null)
            fetchAutos()
          }}
        />
      )}
    </div>
  )
} 