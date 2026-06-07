'use client'

import { useState, useRef } from 'react'
import { apiFetchForm } from '@/lib/api'
import { X, MapPin, Camera, Zap, ChevronDown, CheckCircle } from 'lucide-react'
import { CATEGORIES, ReportCategory } from './mockData'
import dynamic from 'next/dynamic'

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
})

interface ReportFormProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    category: ReportCategory
    description: string
    address: string
    imageUrl?: string
  }) => void
}

export function ReportForm({ onClose, onSubmit }: ReportFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ReportCategory>('jalan_rusak')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('Jakarta Pusat')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [detectingAI, setDetectingAI] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [aiDetected, setAiDetected] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAIDetect = () => {
    if (!imagePreview) return
    setDetectingAI(true)
    setTimeout(() => {
      setCategory('jalan_rusak')
      setTitle('Kerusakan jalan dengan lubang signifikan')
      setDescription('Terdeteksi kerusakan permukaan jalan berupa lubang berukuran besar yang berpotensi membahayakan kendaraan bermotor.')
      setDetectingAI(false)
      setAiDetected(true)
    }, 1800)
  }

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setLocation({ lat, lng })
    setAddress(addr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      alert('Foto laporan wajib disertakan!')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('address', address)
      formData.append('latitude', String(location?.lat ?? -6.2))
      formData.append('longitude', String(location?.lng ?? 106.8))
      formData.append('photo', imageFile)

      await apiFetchForm('/reports', formData)
      onSubmit({
        title,
        category,
        description,
        address,
        imageUrl: imagePreview ?? undefined,
      })
      setStep('success')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setAiDetected(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
        <div className="bg-card border border-border rounded-xl p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <CheckCircle size={32} style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-foreground">Laporan Terkirim!</h2>
          <p className="text-muted-foreground text-sm">Laporan Anda telah diterima dan sedang dianalisis.</p>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#F59E0B' }}>
            <span>🏅</span>
            <span>+20 poin ditambahkan ke akun Anda!</span>
          </div>
          <button onClick={onClose} className="mt-2 w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#3B82F6', color: '#fff' }}>
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-card border border-border rounded-t-2xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-foreground">Laporkan Masalah</h2>
            <p className="text-muted-foreground text-xs mt-0.5">Bantu kami membangun kota yang lebih baik</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="rounded-lg p-3 flex items-start gap-3 border border-border" style={{ background: 'rgba(59,130,246,0.08)' }}>
            <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="text-sm text-foreground bg-transparent w-full outline-none"
                placeholder="Ketik alamat atau pilih dari peta"
              />
            </div>
            <button type="button" onClick={() => setShowMapPicker(true)} className="text-xs text-primary hover:underline flex-shrink-0">
              Pilih dari Peta
            </button>
          </div>

          <div>
            <label className="text-sm text-foreground block mb-2">Foto Masalah</label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="preview" className="w-full h-48 object-cover" />
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); setAiDetected(false); }} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80">
                  <X size={14} />
                </button>
                <button type="button" onClick={handleAIDetect} disabled={detectingAI} className="absolute bottom-2 left-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: '#8B5CF6', color: '#fff' }}>
                  <Zap size={12} />
                  {detectingAI ? 'Mendeteksi AI...' : aiDetected ? '✓ Terdeteksi' : 'Deteksi Otomatis'}
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <Camera size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Klik untuk unggah foto</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG, max 10MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <label className="text-sm text-foreground block mb-2">Kategori Masalah</label>
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value as ReportCategory)} className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border outline-none appearance-none pr-10" style={{ background: 'var(--input-background)' }}>
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm text-foreground block mb-2">Judul Laporan</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Deskripsikan masalah secara singkat..." className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border outline-none placeholder:text-muted-foreground" style={{ background: 'var(--input-background)' }} />
          </div>

          <div>
            <label className="text-sm text-foreground block mb-2">Deskripsi Detail</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Jelaskan kondisi masalah, sejak kapan terjadi, dampak yang dirasakan..." className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border outline-none placeholder:text-muted-foreground resize-none" style={{ background: 'var(--input-background)' }} />
          </div>

          <button type="submit" disabled={loading || !imageFile} className="w-full py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: '#3B82F6', color: '#fff' }}>
            {loading ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
        </form>
      </div>

      {showMapPicker && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </div>
  )
}