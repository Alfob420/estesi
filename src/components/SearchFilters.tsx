'use client'

import { useState } from 'react'
import { FilterValues } from '@/types/types'
import { FunnelIcon } from '@heroicons/react/24/outline'

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void
  marcasDisponibles?: string[]
}

export default function SearchFilters({ onFilterChange, marcasDisponibles = [] }: FilterProps) {
  const [filters, setFilters] = useState<FilterValues>({
    estado: 'todos'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100/50 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <FunnelIcon className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
          {marcasDisponibles.length > 0 ? (
            <select
              name="marca"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={handleChange}
              value={filters.marca || ''}
            >
              <option value="">Todas las marcas</option>
              {marcasDisponibles.map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="marca"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={handleChange}
              placeholder="Buscar por marca..."
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            name="estado"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={handleChange}
            value={filters.estado}
          >
            <option value="todos">Todos</option>
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
            <input
              type="number"
              name="precioMin"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={handleChange}
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
            <input
              type="number"
              name="precioMax"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={handleChange}
              placeholder="$"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 