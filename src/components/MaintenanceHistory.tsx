interface MaintenanceRecord {
  fecha: string
  kilometraje: number
  servicio: string
  descripcion: string
  taller: string
}

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[]
}

export default function MaintenanceHistory({ records }: MaintenanceHistoryProps) {
  if (!records?.length) return null

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Historial de mantenimiento</h2>
      <div className="space-y-4">
        {records.map((record, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{record.servicio}</h3>
                <p className="text-sm text-gray-600">{record.descripcion}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{record.fecha}</p>
                <p className="text-sm text-gray-600">{record.kilometraje.toLocaleString('es-AR')} km</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Taller: {record.taller}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 