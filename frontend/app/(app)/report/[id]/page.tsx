'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { MOCK_REPORTS, CATEGORIES, STATUS_CONFIG } from '@/components/mockData'
import { StatusBadge } from '@/components/StatusBadge'
import { MapPin, Calendar, ThumbsUp } from 'lucide-react'
import ImageViewer from '@/components/ImageViewer'

export default function ReportDetail() {
  const { id } = useParams()
  const report = MOCK_REPORTS.find((r) => r.id === Number(id))
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!report) {
    return <div className="p-6 text-muted-foreground">Laporan tidak ditemukan</div>
  }

  const statuses = [
    'open',
    'dilaporkan',
    'in_progress',
    'dalam_penanganan',
    'diverifikasi',
    'resolved',
    'selesai',
    'rejected',
  ] as const
  const currentIdx = statuses.indexOf(report.status)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">{CATEGORIES[report.category].icon}</span>
        <h1 className="text-xl font-bold text-foreground">{report.title}</h1>
      </div>
      <StatusBadge status={report.status} />

      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full max-h-64 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setLightbox(report.imageUrl!)}
        />
      )}

      <p className="text-muted-foreground leading-relaxed">{report.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} />
          <span>{report.address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={14} />
          <span>{report.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ThumbsUp size={14} />
          <span>{report.upvotes} dukungan</span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Riwayat Status</h3>
        {statuses.map((s, i) => {
          const isReached = i <= currentIdx
          const isCurrent = i === currentIdx
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: isReached ? STATUS_CONFIG[s].color : '#334155' }}
              />
              <span
                className={`text-xs ${
                  isCurrent
                    ? 'text-foreground font-medium'
                    : isReached
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {STATUS_CONFIG[s].label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Image lightbox */}
      {lightbox && (
        <ImageViewer
          src={lightbox}
          alt={report.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}