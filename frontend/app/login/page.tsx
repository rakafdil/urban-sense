'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const loginAs = (role: 'warga' | 'admin') => {
    setLoading(true)
    localStorage.setItem('user_role', role)
    document.cookie = 'cookie_token=demo-token; path=/; max-age=86400'
    if (role === 'admin') router.push('/admin')
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Login UrbanSense</h1>
        <p className="text-sm text-muted-foreground">Pilih peran untuk demo:</p>
        <button
          onClick={() => loginAs('warga')}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-medium hover:opacity-90"
        >
          Masuk sebagai Warga
        </button>
        <button
          onClick={() => loginAs('admin')}
          disabled={loading}
          className="w-full border border-border text-foreground py-3 rounded-lg text-sm font-medium hover:bg-secondary"
        >
          Masuk sebagai Admin
        </button>
      </div>
    </div>
  )
}