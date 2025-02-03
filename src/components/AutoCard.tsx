import Image from 'next/image'
import Link from 'next/link'
import { Auto } from '@/types/types'

interface AutoCardProps {
  auto: Auto
}

export default function AutoCard({ auto }: AutoCardProps) {
  return (
    <Link href={`/autos/${auto.id}`}>
      <div className="card group">
        <div className="relative h-48">
          <Image
            src={auto.imagenes[0]}
            alt={`${auto.marca} ${auto.modelo}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-[#008CBA] text-white px-3 py-1 text-sm rounded-full">
            {auto.estado.toUpperCase()}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white">
              {auto.marca} {auto.modelo}
            </h3>
            <p className="text-[#008CBA] font-bold">
              USD {auto.precio.toLocaleString('es-AR')}
            </p>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{auto.año}</span>
            <span>{auto.kilometraje.toLocaleString('es-AR')} km</span>
          </div>
        </div>
      </div>
    </Link>
  )
} 