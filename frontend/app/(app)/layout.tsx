'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, Map, LayoutDashboard, Shield, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchCurrentUser } from '@/lib/api'

type Role = 'volunteer' | 'admin' | 'relawan'

const NAV_ITEMS = [
  { href: '/map', label: 'Peta Laporan', icon: Map, roles: ['volunteer', 'admin', 'relawan'] },
  { href: '/dashboard', label: 'Dashboard Saya', icon: LayoutDashboard, roles: ['volunteer', 'relawan'] },
  { href: '/admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [role, setRole] = useState<Role>('volunteer')
  const [userName, setUserName] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user_role') as Role | null
    if (!stored) {
      router.replace('/login')
      return
    }
    setRole(stored)
    setChecking(false)

    fetchCurrentUser().then(u => {
      if (u) setUserName(u.fullName || u.email)
    })
  }, [pathname, router])

  if (checking) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0F172A] text-muted-foreground">
        Memeriksa autentikasi...
      </div>
    )
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="flex-shrink-0 border-b border-border flex items-center px-4 h-14 gap-4" style={{ background: '#1E293B' }}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
            <Globe size={14} className="text-white" />
          </div>
          <span className="font-semibold text-foreground text-sm hidden sm:block">UrbanSense</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.filter(n => n.roles.includes(role)).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive(item.href) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden sm:block">
          <span className="text-xs text-muted-foreground font-mono">
            {userName || (role === 'admin' ? 'Admin Kelurahan' : 'Volunteer')}
          </span>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 text-muted-foreground hover:text-foreground">
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border flex-shrink-0" style={{ background: '#1E293B' }}>
          {NAV_ITEMS.filter(n => n.roles.includes(role)).map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-secondary"
              style={isActive(item.href) ? { color: '#3B82F6' } : { color: '#94A3B8' }}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-hidden">{children}</main>

      <nav className="md:hidden border-t border-border flex-shrink-0 flex" style={{ background: '#1E293B' }}>
        {NAV_ITEMS.filter(n => n.roles.includes(role)).map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs"
            style={isActive(item.href) ? { color: '#3B82F6' } : { color: '#64748B' }}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}