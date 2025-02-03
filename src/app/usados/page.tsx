'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Auto } from '@/types/types'
import AutoCard from '@/components/AutoCard'
import SearchFilters from '@/components/SearchFilters'

export default function UsadosPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredAutos, setFilteredAutos] = useState<Auto[]>([])
  const [marcas, setMarcas] = useState<string[]>([])

  useEffect(() => {
    fetchAutos()
  }, [])

  const fetchAutos = async () => {
    try {
      const { data, error } = await supabase
        .from('autos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setAutos(data)
        setFilteredAutos(data)
        // Obtener marcas únicas para los filtros
        const uniqueMarcas = Array.from(new Set(data.map(auto => auto.marca))).sort()
        setMarcas(uniqueMarcas)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: any) => {
    let filtered = [...autos]

    if (filters.marca) {
      filtered = filtered.filter(auto => 
        auto.marca.toLowerCase().includes(filters.marca.toLowerCase())
      )
    }

    if (filters.estado && filters.estado !== 'todos') {
      filtered = filtered.filter(auto => auto.estado === filters.estado)
    }

    if (filters.precioMin) {
      filtered = filtered.filter(auto => auto.precio >= filters.precioMin)
    }

    if (filters.precioMax) {
      filtered = filtered.filter(auto => auto.precio <= filters.precioMax)
    }

    setFilteredAutos(filtered)
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative h-[200px] overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Vehículos Usados
            </h1>
            <p className="text-lg text-gray-200">
              Encuentra el auto perfecto para vos
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4">
        <div className="content-section p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filtros */}
            <div className="lg:col-span-1">
              <SearchFilters 
                onFilterChange={handleFilterChange}
                marcasDisponibles={marcas}
              />
            </div>

            {/* Lista de autos */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredAutos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAutos.map((auto) => (
                    <AutoCard key={auto.id} auto={auto} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron vehículos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 