'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface OfertaDetalleModalProps {
  oferta: any
  onClose: () => void
}

export default function OfertaDetalleModal({ oferta, onClose }: OfertaDetalleModalProps) {
  const autoInfo = oferta.auto_info || oferta.autoInfo || {}
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Detalles de la Oferta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Información del vendedor */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Información del vendedor
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">Nombre:</span> {oferta.nombre_cliente || oferta.nombre}</p>
                <p><span className="font-medium">Email:</span> {oferta.email}</p>
                <p><span className="font-medium">Teléfono:</span> {oferta.telefono}</p>
              </div>
            </div>

            {/* Información del vehículo */}
            {autoInfo && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Información del vehículo
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Marca:</span> {autoInfo.marca}</p>
                  <p><span className="font-medium">Modelo:</span> {autoInfo.modelo}</p>
                  <p><span className="font-medium">Año:</span> {autoInfo.año}</p>
                  {autoInfo.kilometraje && (
                    <p><span className="font-medium">Kilometraje:</span> {autoInfo.kilometraje.toLocaleString()} km</p>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Mensaje del vendedor
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{oferta.mensaje}</p>
              </div>
            </div>

            {/* Galería de imágenes */}
            {autoInfo?.imagenes && autoInfo.imagenes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Fotos del vehículo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {autoInfo.imagenes.map((imagen: string, index: number) => (
                    <div key={index} className="relative aspect-w-3 aspect-h-2">
                      <img
                        src={imagen}
                        alt={`Foto ${index + 1}`}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fecha y estado */}
            <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
              <p>Fecha de oferta: {new Date(oferta.created_at).toLocaleDateString()}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                oferta.estado === 'pendiente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {oferta.estado.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 