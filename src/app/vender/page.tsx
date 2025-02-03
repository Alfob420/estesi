'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function VenderPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imagenes, setImagenes] = useState<File[]>([])
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([])
  const [formData, setFormData] = useState({
    nombreCliente: '',
    email: '',
    telefono: '',
    mensaje: '',
    autoInfo: {
      marca: '',
      modelo: '',
      año: '',
      kilometraje: ''
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + imagenes.length > 5) {
      alert('Máximo 5 imágenes permitidas')
      return
    }
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
    setSuccess(false)

    try {
      // Subir imágenes primero
      const imageUrls = []
      for (const imagen of imagenes) {
        const cleanFileName = imagen.name
          .toLowerCase()
          .replace(/[^a-z0-9.]/g, '-')
        
        const fileName = `${Date.now()}-${cleanFileName}`
        
        const { data, error } = await supabase.storage
          .from('ofertas-venta-imagenes')
          .upload(fileName, imagen, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('ofertas-venta-imagenes')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
      }

      // Crear el objeto de datos con nombres en minúsculas
      const ofertaData = {
        nombre_cliente: formData.nombreCliente,
        email: formData.email,
        telefono: formData.telefono,
        mensaje: formData.mensaje,
        auto_info: {
          marca: formData.autoInfo.marca,
          modelo: formData.autoInfo.modelo,
          año: parseInt(formData.autoInfo.año) || 0,
          kilometraje: parseInt(formData.autoInfo.kilometraje) || 0,
          imagenes: imageUrls
        }
      }

      // Insertar en la base de datos
      const { error } = await supabase
        .from('ofertas_venta')
        .insert([ofertaData])

      if (error) {
        console.error('Error detallado:', error)
        throw error
      }

      setSuccess(true)
      // Limpiar el formulario
      setFormData({
        nombreCliente: '',
        email: '',
        telefono: '',
        mensaje: '',
        autoInfo: {
          marca: '',
          modelo: '',
          año: '',
          kilometraje: ''
        }
      })
      setImagenes([])
      setImagenesPreview([])
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el formulario. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vender tu Auto</h2>
          
          {success && (
            <div className="mb-6 bg-green-50 text-green-800 p-4 rounded-md">
              Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreCliente}
                  onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marca del auto
                </label>
                <input
                  type="text"
                  required
                  value={formData.autoInfo.marca}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoInfo: {...formData.autoInfo, marca: e.target.value}
                  })}
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
                  value={formData.autoInfo.modelo}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoInfo: {...formData.autoInfo, modelo: e.target.value}
                  })}
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
                  value={formData.autoInfo.año}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoInfo: {...formData.autoInfo, año: e.target.value}
                  })}
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
                  value={formData.autoInfo.kilometraje}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoInfo: {...formData.autoInfo, kilometraje: e.target.value}
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mensaje adicional
              </label>
              <textarea
                rows={4}
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#008CBA] focus:ring-[#008CBA]"
              />
            </div>

            {/* Sección de imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos del vehículo (máximo 5)
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
                      <span>Subir fotos</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              </div>

              {/* Preview de imágenes */}
              {imagenesPreview.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {imagenesPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#008CBA] hover:bg-[#007A9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008CBA] disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 