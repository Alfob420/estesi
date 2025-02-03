import { notFound } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Auto } from '@/types/types'
import ImageGallery from '@/components/ImageGallery'
import ContactForm from '@/components/ContactForm'
import SimilarCars from '@/components/SimilarCars'
import MaintenanceHistory from '@/components/MaintenanceHistory'

export default async function AutoDetalle({ params }: { params: { id: string } }) {
  const { data: auto } = await supabase
    .from('autos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!auto) {
    notFound()
  }

  // Ejemplo de registros de mantenimiento (esto debería venir de la base de datos)
  const maintenanceRecords = [
    {
      fecha: '2023-12-15',
      kilometraje: 45000,
      servicio: 'Service completo',
      descripcion: 'Cambio de aceite, filtros y revisión general',
      taller: 'Taller Oficial Toyota'
    },
    // ... más registros
  ]

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery 
          images={auto.imagenes} 
          title={`${auto.marca} ${auto.modelo}`} 
        />

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{auto.marca} {auto.modelo}</h1>
            <p className="text-2xl font-bold text-blue-600">
              ${auto.precio.toLocaleString('es-AR')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-600">Año</span>
              <p className="font-semibold">{auto.año}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-600">Kilometraje</span>
              <p className="font-semibold">{auto.kilometraje.toLocaleString('es-AR')} km</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-600">Transmisión</span>
              <p className="font-semibold">{auto.caracteristicas.transmision}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-600">Combustible</span>
              <p className="font-semibold">{auto.caracteristicas.combustible}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p className="text-gray-600">{auto.descripcion}</p>
          </div>

          <MaintenanceHistory records={maintenanceRecords} />
          <ContactForm autoId={auto.id} />
        </div>
      </div>

      <SimilarCars currentAuto={auto} />
    </main>
  )
} 