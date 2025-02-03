export default function SucursalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="content-section p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuestras Sucursales</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sucursal Tigre</h2>
            <div className="space-y-2 text-gray-600">
              <p>📍 AV ITALIA 1022</p>
              <p>📱 11 3309 6306</p>
              <p>🕒 LUN A VIE 9 A 19 / SAB 9 A 17</p>
            </div>
          </div>
          {/* Agregar más sucursales aquí */}
        </div>
      </div>
    </div>
  )
} 