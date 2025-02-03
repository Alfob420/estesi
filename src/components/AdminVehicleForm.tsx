'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Auto } from '@/types/types'

interface Props {
  auto?: Auto | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminVehicleForm({ auto, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    marca: auto?.marca || '',
    modelo: auto?.modelo || '',
    año: auto?.año || '',
    precio: auto?.precio || '',
    kilometraje: auto?.kilometraje || '',
    estado: auto?.estado || 'usado',
    descripcion: auto?.descripcion || '',
    imagenes: [] as File[]
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Subir imágenes
      const imageUrls = []
      for (const imagen of formData.imagenes) {
        const { data, error } = await supabase.storage
          .from('vehiculos')
          .upload(`${Date.now()}-${imagen.name}`, imagen)
        
        if (error) throw error
        imageUrls.push(data.path)
      }

      const vehiculoData = {
        marca: formData.marca,
        modelo: formData.modelo,
        año: formData.año,
        precio: Number(formData.precio),
        kilometraje: Number(formData.kilometraje),
        estado: formData.estado,
        descripcion: formData.descripcion,
        imagenes: imageUrls
      }

      if (auto) {
        // Actualizar
        const { error } = await supabase
          .from('autos')
          .update(vehiculoData)
          .eq('id', auto.id)
        
        if (error) throw error
      } else {
        // Insertar nuevo
        const { error } = await supabase
          .from('autos')
          .insert([vehiculoData])
        
        if (error) throw error
      }

      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el vehículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {auto ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <input
                  type="text"
                  required
                  value={formData.marca}
                  onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <input
                  type="text"
                  required
                  value={formData.modelo}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>
            </div>

            {/* Agregar más campos del formulario... */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Imágenes</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData(prev => ({
                      ...prev,
                      imagenes: Array.from(e.target.files!)
                    }))
                  }
                }}
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : auto ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 