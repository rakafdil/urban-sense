'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isRegister) {
        // Register dulu
        await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, fullName }),
        })
        // Setelah register, langsung login
      }

      // Login
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      // Ambil role dari response (backend mungkin mengirimkan role)
      // Jika tidak ada, kita bisa fetch /users/me untuk mendapatkan role
      let role: 'volunteer' | 'admin' = 'volunteer'
      try {
        const userData = await apiFetch('/users/me')
        if (userData && userData.role) {
          role = userData.role
        }
      } catch {
        // Fallback: jika gagal fetch role, gunakan volunteer
        console.warn('Tidak bisa mendapatkan role, fallback ke volunteer')
      }

      localStorage.setItem('user_role', role)
      document.cookie = `cookie_token=${res.access_token}; path=/; max-age=86400`

      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          {isRegister ? 'Daftar UrbanSense' : 'Login UrbanSense'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm text-foreground block mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border bg-input-background placeholder:text-muted-foreground outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm text-foreground block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border bg-input-background placeholder:text-muted-foreground outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-foreground block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground border border-border bg-input-background placeholder:text-muted-foreground outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isRegister ? 'Daftar & Masuk' : 'Masuk'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-primary hover:underline"
          >
            {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </div>
      </div>
    </div>
  )
}