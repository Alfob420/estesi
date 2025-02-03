'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Auto } from '@/types/types'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AutoFormProps {
  auto?: Auto
  onClose: () => void
  onSuccess: () => void
}

export default function AutoForm({ auto, onClose, onSuccess }: AutoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    marca: auto?.marca || '',
    modelo: auto?.modelo || '',
    año: auto?.año || new Date().getFullYear(),
    kilometraje: auto?.kilometraje || 0,
    precio: auto?.precio || 0,
    descripcion: auto?.descripcion || '',
    estado: auto?.estado || 'usado',
    caracteristicas: auto?.caracteristicas || {
      transmision: '',
      combustible: '',
      motor: '',
      color: '',
      gnc: false,
      vtv: false
    }
  })
  const [imagenes, setImagenes] = useState<File[]>([])
  const [imagenesPreview, setImagenesPreview] = useState<string[]>(auto?.imagenes || [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImagenes([...imagenes, ...files])

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenesPreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index))
    setImagenesPreview(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Subir imágenes a Supabase Storage
      const imageUrls = []
      for (const imagen of imagenes) {
        const fileName = `${Date.now()}-${imagen.name}`
        const { data, error } = await supabase.storage
          .from('autos-imagenes')
          .upload(fileName, imagen)

        if (error) throw error
        const { data: { publicUrl } } = supabase.storage
          .from('autos-imagenes')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
      }

      // Crear o actualizar auto en la base de datos
      const autoData = {
        ...formData,
        imagenes: [...(auto?.imagenes || []), ...imageUrls]
      }

      if (auto) {
        // Actualizar
        const { error } = await supabase
          .from('autos')
          .update(autoData)
          .eq('id', auto.id)
        if (error) throw error
      } else {
        // Crear nuevo
        const { error } = await supabase
          .from('autos')
          .insert([autoData])
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {auto ? 'Editar Auto' : 'Agregar Nuevo Auto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                type="text"
                required
                value={formData.marca}
                onChange={e => setFormData({...formData, marca: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Modelo
              </label>
              <input
                type="text"
                required
                value={formData.modelo}
                onChange={e => setFormData({...formData, modelo: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Año
              </label>
              <input
                type="number"
                required
                value={formData.año}
                onChange={e => setFormData({...formData, año: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kilometraje
              </label>
              <input
                type="number"
                required
                value={formData.kilometraje}
                onChange={e => setFormData({...formData, kilometraje: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio (USD)
              </label>
              <input
                type="number"
                required
                value={formData.precio}
                onChange={e => setFormData({...formData, precio: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={e => setFormData({...formData, estado: e.target.value as 'nuevo' | 'usado'})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmisión
              </label>
              <input
                type="text"
                value={formData.caracteristicas.transmision}
                onChange={e => setFormData({
                  ...formData,
                  caracteristicas: {...formData.caracteristicas, transmision: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Combustible
              </label>
              <input
                type="text"
                value={formData.caracteristicas.combustible}
                onChange={e => setFormData({
                  ...formData,
                  caracteristicas: {...formData.caracteristicas, combustible: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motor
              </label>
              <input
                type="text"
                value={formData.caracteristicas.motor}
                onChange={e => setFormData({
                  ...formData,
                  caracteristicas: {...formData.caracteristicas, motor: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                value={formData.caracteristicas.color}
                onChange={e => setFormData({
                  ...formData,
                  caracteristicas: {...formData.caracteristicas, color: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            <div className="col-span-2 flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gnc"
                  checked={formData.caracteristicas.gnc}
                  onChange={e => setFormData({
                    ...formData,
                    caracteristicas: {
                      ...formData.caracteristicas,
                      gnc: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-[#008CBA] focus:ring-[#008CBA] border-gray-300 rounded"
                />
                <label htmlFor="gnc" className="ml-2 block text-sm text-gray-900">
                  Equipado con GNC
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="vtv"
                  checked={formData.caracteristicas.vtv}
                  onChange={e => setFormData({
                    ...formData,
                    caracteristicas: {
                      ...formData.caracteristicas,
                      vtv: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-[#008CBA] focus:ring-[#008CBA] border-gray-300 rounded"
                />
                <label htmlFor="vtv" className="ml-2 block text-sm text-gray-900">
                  VTV al día
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              rows={4}
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imágenes
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#008CBA] hover:text-[#007A9E]"
                  >
                    <span>Subir imágenes</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Preview de imágenes */}
            {imagenesPreview.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagenesPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#008CBA] border border-transparent rounded-md hover:bg-[#007A9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008CBA] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 