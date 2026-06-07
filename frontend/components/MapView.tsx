'use client'

import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Memuat peta...
    </div>
  ),
})

export function MapView() {
  return (
    <div className="h-full w-full">
      <MapClient />
    </div>
  )
}