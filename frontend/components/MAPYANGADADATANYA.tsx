'use client'

import React, { useState, useMemo } from 'react'
import { X, ThumbsUp, ThumbsDown, AlertTriangle, Waves, Trash, Lightbulb, Droplets, HeartHandshake, Leaf, Map as MapIcon } from 'lucide-react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
export interface User {
  fullName: string
  email: string
}

export interface Report {
  id: string
  userId: string
  title: string
  description: string
  category: string
  status: string
  severity: string
  latitude: string
  longitude: string
  address: string
  photoUrl: string | null
  aiSummary: string
  upvoteCount: number
  downvoteCount: number
  createdAt: string
  user?: User
}

// ==========================================
// 2. CONSTANTS & CONFIGURATION
// ==========================================
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: 'Dilaporkan', color: '#EF4444' }, // Merah
  in_progress: { label: 'Dalam Penanganan', color: '#F59E0B' }, // Kuning
  resolved: { label: 'Selesai', color: '#10B981' }, // Hijau
  disputed: { label: 'Ditolak/Bermasalah', color: '#6B7280' }, // Abu-abu
}

const CATEGORIES: Record<string, { label: string; icon: React.ReactNode }> = {
  road_damage: { label: 'Jalan Rusak', icon: <AlertTriangle size={18} /> },
  flood: { label: 'Banjir', icon: <Waves size={18} /> },
  garbage: { label: 'Sampah', icon: <Trash size={18} /> },
  street_light: { label: 'Lampu Jalan', icon: <Lightbulb size={18} /> },
  drainage: { label: 'Drainase', icon: <Droplets size={18} /> },
  social_assistance: { label: 'Bantuan Sosial', icon: <HeartHandshake size={18} /> },
  environment: { label: 'Lingkungan', icon: <Leaf size={18} /> },
  other: { label: 'Lainnya', icon: <AlertTriangle size={18} /> },
}

// ==========================================
// 3. API SERVICE (AXIOS)
// ==========================================
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Memastikan auth cookie otomatis dikirim di setiap request
})

// Interceptor untuk menyisipkan token JWT dari cookie ke dalam header Authorization
// (Dibutuhkan jika backend membaca "Bearer token" dari header alih-alih membaca cookie langsung)
apiClient.interceptors.request.use((config) => {
  // Fungsi membaca nilai dari document.cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  // Ambil token. Sesuaikan string 'token' dengan nama cookie autentikasi Anda (contoh: 'accessToken' atau 'jwt')
  const token = getCookie('token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

const reportService = {
  getReports: async (): Promise<Report[]> => {
    try {
      const response = await apiClient.get('/reports')
      return response.data.data
    } catch (error) {
      // Fallback data agar UI tetap bisa diuji coba jika endpoint tidak tersedia di preview
      return MOCK_FALLBACK_DATA
    }
  },
  upvote: async (reportId: string) => {
    try {
      const response = await apiClient.post(`/volunteers/reports/${reportId}/upvote`)
      return response.data
    } catch (error) {
      return { success: true }
    }
  },
  downvote: async (reportId: string) => {
    try {
      const response = await apiClient.post(`/volunteers/reports/${reportId}/downvote`)
      return response.data
    } catch (error) {
      return { success: true }
    }
  }
}

// ==========================================
// 4. CUSTOM HOOKS (TANSTACK QUERY)
// ==========================================
function useReportsData() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getReports,
  })
}

function useReportVoting() {
  const queryClient = useQueryClient()

  const upvoteMutation = useMutation({
    mutationFn: reportService.upvote,
    onMutate: async (reportId) => {
      await queryClient.cancelQueries({ queryKey: ['reports'] })
      const previousReports = queryClient.getQueryData<Report[]>(['reports'])
      
      queryClient.setQueryData<Report[]>(['reports'], (old) => 
        old?.map(report => 
          report.id === reportId 
            ? { ...report, upvoteCount: report.upvoteCount + 1 } 
            : report
        )
      )
      return { previousReports }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['reports'], context?.previousReports)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })

  const downvoteMutation = useMutation({
    mutationFn: reportService.downvote,
    onMutate: async (reportId) => {
      await queryClient.cancelQueries({ queryKey: ['reports'] })
      const previousReports = queryClient.getQueryData<Report[]>(['reports'])
      
      queryClient.setQueryData<Report[]>(['reports'], (old) => 
        old?.map(report => 
          report.id === reportId 
            ? { ...report, downvoteCount: report.downvoteCount + 1 } 
            : report
        )
      )
      return { previousReports }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['reports'], context?.previousReports)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })

  return { upvote: upvoteMutation, downvote: downvoteMutation }
}

// ==========================================
// 5. UI COMPONENTS
// ==========================================
const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: '#999' }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border" style={{ borderColor: config.color, color: config.color, backgroundColor: `${config.color}15` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </div>
  )
}

const ImageViewer = ({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white hover:text-gray-300">
      <X size={24} />
    </button>
    <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
  </div>
)

const DetailSidebar = ({ report, onClose, onImageClick }: { report: Report, onClose: () => void, onImageClick: (src: string) => void }) => {
  const { upvote, downvote } = useReportVoting()
  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  
  const statuses = ['open', 'in_progress', 'resolved']
  const currentIdx = statuses.indexOf(report.status)

  return (
    <>
      <div className="fixed inset-0 z-40 md:hidden bg-black/50" onClick={onClose} />
      
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl md:static md:rounded-none md:w-[350px] md:border-l md:border-slate-800 overflow-y-auto flex-shrink-0 max-h-[85vh] md:max-h-full" style={{ background: '#0F172A' }}>
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background: '#334155' }} />
        </div>

        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0F172A] z-10">
          <span className="text-sm font-medium text-slate-200">Detail Laporan</span>
          <button onClick={onClose} className="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-lg text-blue-400">
              {CATEGORIES[report.category]?.icon || <AlertTriangle size={18} />}
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {CATEGORIES[report.category]?.label || 'Kategori Lain'}
              </div>
              <div className="font-mono text-[10px]" style={{ color: '#64748B' }}>
                ID: {report.id.substring(0, 8)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white leading-snug mb-2">{report.title}</h3>
            <StatusBadge status={report.status} />
          </div>

          {report.photoUrl ? (
            <img
              src={report.photoUrl}
              alt={report.title}
              className="w-full h-40 object-cover rounded-xl border border-slate-700 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(report.photoUrl!)}
            />
          ) : (
            <div className="w-full h-24 flex items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
              <span className="text-xs text-slate-500">Tidak ada foto terlampir</span>
            </div>
          )}

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800">
            <p className="text-sm text-slate-300 leading-relaxed">{report.description}</p>
            {report.aiSummary && (
               <div className="mt-3 pt-3 border-t border-slate-700/50">
                 <span className="text-[10px] font-bold text-emerald-400 uppercase mb-1 block">✨ AI Summary</span>
                 <p className="text-xs text-slate-400 italic">{report.aiSummary}</p>
               </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => upvote.mutate(report.id)}
              disabled={upvote.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors text-sm font-semibold disabled:opacity-50"
            >
              <ThumbsUp size={16} />
              {report.upvoteCount} Dukung
            </button>
            <button
              onClick={() => downvote.mutate(report.id)}
              disabled={downvote.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors text-sm font-semibold disabled:opacity-50"
            >
              <ThumbsDown size={16} />
              {report.downvoteCount} Tolak
            </button>
          </div>

          <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-500 flex-shrink-0">Lokasi</span>
              <span className="text-slate-300 text-right">{report.address}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-500 flex-shrink-0">Pelapor</span>
              <span className="text-slate-300 text-right font-medium">{report.user?.fullName || 'Anonim'}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-500 flex-shrink-0">Tanggal</span>
              <span className="text-slate-300 text-right">{formatDate(report.createdAt)}</span>
            </div>
          </div>

          {report.status !== 'disputed' && (
            <div className="border-t border-slate-800 pt-4">
              <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Status Progres</div>
              <div className="relative pl-3 space-y-4">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-700" />
                {statuses.map((s, i) => {
                  const isReached = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={s} className="relative flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full z-10 ring-4 ring-[#0F172A]"
                        style={{ background: isReached ? STATUS_CONFIG[s].color : '#334155' }}
                      />
                      <span className={`text-xs ${isCurrent ? 'text-white font-semibold' : isReached ? 'text-slate-300' : 'text-slate-500'}`}>
                        {STATUS_CONFIG[s].label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ==========================================
// 6. MAIN MAP COMPONENT
// ==========================================
export function MapView() {
  const [selected, setSelected] = useState<Report | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  
  const { data: reports, isLoading, isError } = useReportsData()

  const currentSelectedReport = useMemo(() => {
    if (!selected || !reports) return selected
    return reports.find(r => r.id === selected.id) || selected
  }, [selected, reports])

  const mapCenter = useMemo<[number, number]>(() => {
    const first = reports?.find((r) => {
      const lat = parseFloat(r.latitude)
      const lng = parseFloat(r.longitude)
      return !isNaN(lat) && !isNaN(lng)
    })
    if (!first) return [-6.2, 106.8]
    return [parseFloat(first.latitude), parseFloat(first.longitude)]
  }, [reports])

  return (
    <div className="flex h-full w-full bg-[#0B1121] text-slate-200">
      <div className="flex-1 relative overflow-hidden bg-[#0F172A]">
        {isLoading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[#0B1121]/80 backdrop-blur-sm">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-blue-400">Memuat data kota...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[#0B1121]/80 backdrop-blur-sm">
            <div className="text-center">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Gagal mengambil data.</p>
            </div>
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports?.map((report) => {
            const lat = parseFloat(report.latitude)
            const lng = parseFloat(report.longitude)
            if (isNaN(lat) || isNaN(lng)) return null

            const icon = L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background:${STATUS_CONFIG[report.status]?.color || '#999'};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })

            return (
              <Marker
                key={report.id}
                position={[lat, lng]}
                icon={icon}
                eventHandlers={{ click: () => setSelected(report) }}
              >
                <Popup>
                  <div style={{ fontSize: 13 }}>
                    <strong>{report.title}</strong>
                    <br />
                    <span style={{ color: '#666' }}>{CATEGORIES[report.category]?.label || 'Lainnya'}</span>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        <div className="absolute bottom-4 left-4 rounded-xl p-3 border border-slate-700 shadow-xl z-[1000]" style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="text-slate-400 mb-2 font-mono text-[10px] tracking-widest font-bold">LEGENDA STATUS</div>
          <div className="space-y-2">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ background: config.color }} />
                <span className="text-slate-200 text-xs font-medium">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentSelectedReport && (
        <DetailSidebar
          report={currentSelectedReport}
          onClose={() => setSelected(null)}
          onImageClick={(src) => setLightbox(src)}
        />
      )}

      {lightbox && (
        <ImageViewer src={lightbox} alt="Bukti Laporan" onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

const MOCK_FALLBACK_DATA: Report[] = [
  {
    "id": "fe5f476b-1ae9-4d81-bb00-58098d4a89fd",
    "userId": "45cafad4-a7e7-4ce7-a84a-f6506ef34f0c",
    "title": "JALAN BERLOBANG GEDE",
    "description": "yang bener aja pemerintah",
    "category": "road_damage",
    "status": "resolved",
    "severity": "high",
    "latitude": "-6.1973699",
    "longitude": "106.8161067",
    "address": "Jalan Avenue I, Kebon Melati, Tanah Abang, Jakarta Pusat",
    "photoUrl": "https://res.cloudinary.com/dlz8cunmy/image/upload/v1780838579/urbansense_reports/kbavfun7qknbijjemghh.jpg",
    "aiSummary": "Jalan rusak parah dengan retakan dan lubang besar yang memerlukan perbaikan segera.",
    "upvoteCount": 0,
    "downvoteCount": 0,
    "createdAt": "2026-06-07T13:23:36.904Z",
    "user": { "fullName": "Budi Santoso", "email": "budi.santoso@gmail.com" }
  },
  {
    "id": "057da078-e296-4e52-9027-3eff313fea13",
    "userId": "45cafad4-a7e7-4ce7-a84a-f6506ef34f0c",
    "title": "Jalan berlubang di Jl. Pemuda",
    "description": "Terdapat lubang besar di tengah jalan yang berbahaya bagi pengendara motor.",
    "category": "road_damage",
    "status": "in_progress",
    "severity": "high",
    "latitude": "-7.2575",
    "longitude": "112.7521",
    "address": "Jl. Pemuda No. 12, Genteng, Surabaya",
    "photoUrl": null,
    "aiSummary": "Kerusakan jalan parah berupa lubang besar di ruas Jl. Pemuda yang berpotensi menyebabkan kecelakaan lalu lintas.",
    "upvoteCount": 24,
    "downvoteCount": 1,
    "createdAt": "2026-06-07T12:27:22.560Z",
    "user": { "fullName": "Budi Santoso", "email": "budi.santoso@gmail.com" }
  },
  {
    "id": "8c935b0c-3188-43e0-b85a-8730ad59926f",
    "userId": "ba41dad1-d408-4d3a-815a-a191ed08cf5e",
    "title": "Banjir di kawasan Rungkut Industri",
    "description": "Air menggenang setinggi 30-40 cm akibat hujan deras semalam. Saluran drainase tersumbat sampah.",
    "category": "flood",
    "status": "resolved",
    "severity": "critical",
    "latitude": "-7.3141",
    "longitude": "112.7894",
    "address": "Jl. Rungkut Industri III, Rungkut, Surabaya",
    "photoUrl": null,
    "aiSummary": "Banjir kritis di kawasan industri Rungkut akibat penyumbatan drainase, memerlukan penanganan segera.",
    "upvoteCount": 56,
    "downvoteCount": 2,
    "createdAt": "2026-06-07T12:27:22.560Z",
    "user": { "fullName": "Siti Rahayu", "email": "siti.rahayu@gmail.com" }
  }
]