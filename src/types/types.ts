export interface Auto {
  id: string
  marca: string
  modelo: string
  año: number
  kilometraje: number
  precio: number
  descripcion: string
  imagenes: string[]
  estado: 'nuevo' | 'usado'
  caracteristicas: {
    transmision: string
    combustible: string
    motor: string
    color: string
    gnc: boolean
    vtv: boolean
  }
  created_at?: string
}

export interface Consulta {
  id: string
  auto_id?: string
  nombre: string
  email: string
  telefono: string
  mensaje: string
  estado: 'pendiente' | 'respondida'
  tipo: 'consulta' | 'venta'
  created_at?: string
  auto?: {
    id: string
    marca: string
    modelo: string
    año: number
    imagenes: string[]
  }
  autoInfo?: {
    marca?: string
    modelo?: string
    año?: number
    kilometraje?: number
    imagenes?: string[]
  }
}

export interface FilterValues {
  marca?: string
  modelo?: string
  precioMin?: number
  precioMax?: number
  estado?: 'nuevo' | 'usado' | 'todos'
}

export interface ContactForm {
  nombre: string
  email: string
  telefono: string
  mensaje: string
} 