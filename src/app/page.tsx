'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { supabase } from '@/lib/supabaseClient'
import { Auto } from '@/types/types'
import AutoCard from '@/components/AutoCard'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'

export default function Home() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [autosDestacados, setAutosDestacados] = useState<Auto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAutos()
    fetchAutosDestacados()
  }, [])

  const fetchAutos = async () => {
    try {
      const { data, error } = await supabase
        .from('autos')
        .select('*')
        .limit(5)
      
      if (error) {
        console.error('Error fetching autos:', error)
        return
      }
      
      console.log('Autos fetched:', data) // Para debug
      if (data) setAutos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAutosDestacados = async () => {
    try {
      const { data, error } = await supabase
        .from('autos')
        .select('*')
        .order('vistas', { ascending: false })
        .limit(6)
      
      if (error) {
        console.error('Error fetching autos destacados:', error)
        return
      }
      
      console.log('Autos destacados fetched:', data) // Para debug
      if (data) setAutosDestacados(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="relative h-[500px]">
          <div className="container mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full py-8">
              {/* Slider de autos - 8 columnas */}
              <div className="lg:col-span-8 search-container overflow-hidden">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008CBA]"></div>
                  </div>
                ) : (
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="h-full w-full"
                  >
                    {autos.map((auto) => (
                      <SwiperSlide key={auto.id}>
                        <div className="relative h-full w-full group cursor-pointer">
                          <img
                            src={auto.imagenes[0]}
                            alt={`${auto.marca} ${auto.modelo}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h3 className="text-3xl font-bold text-white mb-2">
                              {auto.marca} {auto.modelo}
                            </h3>
                            <div className="flex justify-between items-center">
                              <p className="text-2xl font-bold text-[#008CBA]">
                                USD {auto.precio.toLocaleString('es-AR')}
                              </p>
                              <div className="flex gap-4 text-gray-300">
                                <span>{auto.año}</span>
                                <span>{auto.kilometraje.toLocaleString('es-AR')} km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Filtros de búsqueda - 4 columnas */}
              <div className="lg:col-span-4 search-container p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <select className="search-select">
                      <option>TODAS LAS UBICACIONES</option>
                      <option>Tigre</option>
                      <option>San Fernando</option>
                      <option>San Isidro</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  </div>

                  <div className="relative">
                    <select className="search-select">
                      <option>TODAS LAS MARCAS</option>
                      <option>Toyota</option>
                      <option>Honda</option>
                      <option>Volkswagen</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  </div>

                  <div className="relative">
                    <select className="search-select">
                      <option>AÑO</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  </div>

                  <div className="relative">
                    <select className="search-select">
                      <option>CUALQUIER PRECIO</option>
                      <option>Hasta USD 10.000</option>
                      <option>USD 10.000 - USD 20.000</option>
                      <option>Más de USD 20.000</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  </div>

                  <button className="btn-search w-full">
                    BUSCAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador decorativo */}
      <div className="section-divider" />

      {/* Contenido principal */}
      <section className="page-section">
        <div className="section-background" />
        <div className="container mx-auto px-4">
          {/* Ofertas Destacadas */}
          <div className="featured-section">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-[#008CBA]" />
                <h2 className="text-3xl font-bold text-gray-900">Ofertas Destacadas</h2>
              </div>
              <a href="/usados" className="text-[#008CBA] hover:text-[#007A9E] transition-colors font-medium">
                Ver todo el inventario →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {autos.slice(0, 3).map((auto) => (
                <AutoCard key={auto.id} auto={auto} />
              ))}
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="section-divider" />

          {/* Más Vistos */}
          <div className="featured-section">
            <div className="flex items-center gap-2 mb-8">
              <FireIcon className="h-6 w-6 text-[#008CBA]" />
              <h2 className="text-3xl font-bold text-gray-900">Los Más Vistos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {autosDestacados.map((auto) => (
                <div key={auto.id} className="card group">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={auto.imagenes[0]}
                      alt={`${auto.marca} ${auto.modelo}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 truncate">
                      {auto.marca} {auto.modelo}
                    </h3>
                    <p className="text-[#008CBA] font-bold">
                      USD {auto.precio.toLocaleString('es-AR')}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{auto.año}</span>
                      <span>{auto.kilometraje.toLocaleString('es-AR')} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Separador decorativo final */}
      <div className="section-divider" />
    </div>
  )
} 