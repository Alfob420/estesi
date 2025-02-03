import './globals.css'
import Link from 'next/link'
// Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="extension-disable" content="true" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <nav className="nav-container">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  {/* Puedes agregar un logo aquí */}
                </div>
                <span className="text-2xl font-bold text-white">
                  TOTOS CARS
                </span>
              </Link>
              <div className="flex gap-8 text-sm font-medium text-gray-300">
                <Link href="/usados" className="nav-link">USADOS</Link>
                <Link href="/vender" className="nav-link">VENDER</Link>
                <Link href="/sucursales" className="nav-link">SUCURSALES</Link>
                <Link href="/puerta-a-puerta" className="nav-link">PUERTA A PUERTA</Link>
                <Link href="/contacto" className="btn-primary">CONTACTO</Link>
                <Link 
                  href="/panel"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  INGRESAR
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
} 