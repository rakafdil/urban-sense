'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LocationPickerProps {
  onSelect: (lat: number, lng: number, address: string) => void
  onClose: () => void
}

// Komponen untuk menangani klik peta
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Fungsi reverse geocoding menggunakan Nominatim
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
    )
    const data = await res.json()
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

export default function LocationPicker({ onSelect, onClose }: LocationPickerProps) {
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedPos([lat, lng])
    setLoading(true)
    const address = await reverseGeocode(lat, lng)
    setLoading(false)
    onSelect(lat, lng, address)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-foreground text-sm font-medium">Pilih Lokasi di Peta</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        <div className="h-80">
          <MapContainer
            center={[-6.2, 106.8]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onSelect={handleMapClick} />
            {selectedPos && <Marker position={selectedPos} />}
          </MapContainer>
        </div>
        <div className="p-3 text-xs text-muted-foreground text-center border-t border-border">
          {loading ? 'Mendapatkan alamat...' : 'Klik di peta untuk memilih lokasi'}
        </div>
      </div>
    </div>
  )
}