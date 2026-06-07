'use client'

import { useState, useEffect } from 'react'
import { Plus, Bell, Star, Award, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronRight, MapPin, Calendar, X, Trophy } from 'lucide-react'
import { MOCK_REPORTS, MOCK_USER, CATEGORIES, STATUS_CONFIG, Report, ReportCategory } from './mockData'
import { StatusBadge } from './StatusBadge'
import { ReportForm } from './ReportForm'
import ImageViewer from '@/components/ImageViewer'
import { fetchCurrentUser } from '@/lib/api'

const NOTIFICATIONS = [
  { id: 1, message: 'Laporan "Jalan berlubang di Jl. Sudirman" berubah ke Dalam Penanganan', time: '2 jam lalu', read: false },
  { id: 2, message: 'Laporan "Jembatan pejalan kaki retak" telah Diverifikasi', time: '5 jam lalu', read: false },
  { id: 3, message: 'Laporan "Tumpukan sampah TPS" berhasil Selesai', time: '1 hari lalu', read: true },
]

type Tab = 'laporan' | 'profil'

export function WargaDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS.filter(r => r.reporterId === 1))
  const [selected, setSelected] = useState<Report | null>(null)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<Tab>('laporan')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [user, setUser] = useState(MOCK_USER)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    async function loadUser() {
      const userData = await fetchCurrentUser()
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.fullName || userData.email,
          email: userData.email,
          points: userData.totalPoints || 0,
          level: 'Kontributor Aktif',
          reports: 0,
          verified: 0,
          badges: [
            { id: 1, name: 'Pelopor', icon: '🏅', desc: 'Laporan pertama' },
          ],
        })
      }
    }
    loadUser()
  }, [])

  const handleSubmit = (data: { title: string; category: ReportCategory; description: string; address: string; imageUrl?: string }) => {
    const newReport: Report = {
      id: Date.now(),
      ...data,
      status: 'dilaporkan',
      location: 'Kel. Menteng',
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      reporter: user.name,
      reporterId: user.id,
      mapX: 50,
      mapY: 50,
      upvotes: 0,
    }
    setReports(prev => [newReport, ...prev])
  }

  const myStats = [
    { label: 'Total', value: reports.length + 10, icon: <AlertCircle size={15} />, color: '#3B82F6' },
    { label: 'Selesai', value: reports.filter(r => r.status === 'selesai').length + 4, icon: <CheckCircle size={15} />, color: '#10B981' },
    { label: 'Proses', value: reports.filter(r => r.status !== 'selesai').length + 4, icon: <Clock size={15} />, color: '#F59E0B' },
    { label: 'Poin', value: user.points, icon: <Star size={15} />, color: '#8B5CF6' },
  ]

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden" style={{ background: '#0F172A' }}>
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-border flex-shrink-0" style={{ background: '#1E293B' }}>
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h1 className="text-foreground truncate">Hai, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Pantau dan kelola laporan Anda.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button onClick={() => { setShowNotif(!showNotif) }} className="p-2 rounded-lg border border-border transition-colors relative" style={{ background: '#0F172A' }}>
                <Bell size={16} className="text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ background: '#EF4444' }}>{unreadCount}</span>
                )}
              </button>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                  <div className="absolute right-0 top-full mt-2 rounded-xl border border-border shadow-2xl z-50 overflow-hidden" style={{ background: '#1E293B', width: 'min(320px, calc(100vw - 2rem))' }}>
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Notifikasi</span>
                      <button onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))} className="text-xs hover:opacity-80" style={{ color: '#3B82F6' }}>Tandai dibaca</button>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-border last:border-0 flex gap-3" style={{ background: n.read ? 'transparent' : 'rgba(59,130,246,0.05)' }}>
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.read ? 'transparent' : '#3B82F6' }} />
                        <div>
                          <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#3B82F6', color: '#fff' }}>
              <Plus size={15} />
              <span className="hidden sm:inline">Laporkan</span>
              <span className="sm:hidden">Lapor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {myStats.map(s => (
            <div key={s.label} className="rounded-lg p-2 sm:p-3 border border-border flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3" style={{ background: '#0F172A' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-base sm:text-lg font-bold text-foreground leading-none">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-0 mt-3 lg:hidden border border-border rounded-lg overflow-hidden">
          {(['laporan', 'profil'] as Tab[]).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2 text-xs font-medium transition-colors capitalize" style={{ background: activeTab === t ? '#3B82F6' : 'transparent', color: activeTab === t ? '#fff' : '#64748B' }}>
              {t === 'laporan' ? '📋 Laporan Saya' : '🏅 Profil & Badge'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 ${activeTab !== 'laporan' ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp size={14} style={{ color: '#3B82F6' }} /> Laporan Saya
            </h2>
            <span className="text-xs text-muted-foreground font-mono">{reports.length}</span>
          </div>

          {reports.map(r => (
            <div key={r.id} onClick={() => setSelected(selected?.id === r.id ? null : r)} className="rounded-xl p-4 border border-border cursor-pointer transition-all" style={{ background: selected?.id === r.id ? 'rgba(59,130,246,0.06)' : '#1E293B' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>{CATEGORIES[r.category].icon}</span>
                    <span className="text-xs text-muted-foreground">{CATEGORIES[r.category].label}</span>
                  </div>
                  <h3 className="text-sm text-foreground leading-snug">{r.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin size={10} />{r.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} />{r.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={r.status} size="sm" />
                  <ChevronRight size={14} className={`text-muted-foreground transition-transform ${selected?.id === r.id ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {selected?.id === r.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {r.imageUrl && (
                    <img src={r.imageUrl} alt={r.title} className="w-full h-40 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90" onClick={() => setLightbox(r.imageUrl!)} />
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Diperbarui: {r.updatedAt}</span>
                    <span>{r.upvotes} dukungan</span>
                  </div>
                  <div className="space-y-1.5">
                    {(['dilaporkan', 'diverifikasi', 'dalam_penanganan', 'selesai'] as const).map((s, i) => {
                      const currentIdx = (['dilaporkan', 'diverifikasi', 'dalam_penanganan', 'selesai'] as const).indexOf(r.status)
                      const isReached = i <= currentIdx
                      const isCurrent = i === currentIdx
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isReached ? STATUS_CONFIG[s].color : '#334155' }} />
                          <span className={`text-xs ${isCurrent ? 'text-foreground font-medium' : isReached ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {STATUS_CONFIG[s].label}
                          </span>
                          {isCurrent && <span className="ml-auto text-xs font-mono text-muted-foreground">{r.updatedAt}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`overflow-y-auto lg:w-64 lg:border-l lg:border-border lg:flex-shrink-0 ${activeTab === 'profil' ? 'flex-1' : 'hidden lg:block'}`} style={{ background: '#162032' }}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm text-foreground font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.level}</div>
              </div>
            </div>
            <div className="rounded-lg p-3 border border-border" style={{ background: '#0F172A' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total Poin</span>
                <span className="flex items-center gap-1 text-sm font-bold" style={{ color: '#F59E0B' }}><Star size={13} /> {user.points}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#1E293B' }}>
                <div className="h-full rounded-full" style={{ width: `${(user.points % 500) / 5}%`, background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">{500 - (user.points % 500)} poin lagi ke level berikutnya</div>
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3"><Award size={14} style={{ color: '#F59E0B' }} /><span className="text-sm text-foreground">Badge Saya</span></div>
            <div className="grid grid-cols-2 gap-2">
              {user.badges.map(b => (
                <div key={b.id} className="rounded-lg p-2.5 border border-border text-center" style={{ background: '#0F172A' }}>
                  <div className="text-xl mb-1">{b.icon}</div>
                  <div className="text-xs text-foreground font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3"><Trophy size={14} style={{ color: '#F59E0B' }} /><span className="text-sm text-foreground">Top Pelapor Minggu Ini</span></div>
            {[{ name: 'Dewi Purnama', pts: 580, rank: 1 }, { name: 'Ahmad Fauzi', pts: 420, rank: 2 }, { name: user.name, pts: user.points, rank: 3 }].map(u => (
              <div key={u.name} className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg mb-1" style={{ background: u.name === user.name ? 'rgba(59,130,246,0.08)' : 'transparent', border: u.name === user.name ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }}>
                <span className="font-mono text-xs w-4 text-muted-foreground">{u.rank}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0" style={{ background: u.rank === 1 ? '#F59E0B' : '#334155' }}>{u.name.charAt(0)}</div>
                <span className="text-xs text-foreground flex-1 truncate">{u.name}</span>
                <span className="text-xs font-mono" style={{ color: '#F59E0B' }}>{u.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <ReportForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />
      )}

      {lightbox && (
        <ImageViewer src={lightbox} alt="Gambar Laporan" onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}