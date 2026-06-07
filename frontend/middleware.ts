// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil role dari cookie (sudah disimpan saat login)
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Jika rute dimulai dengan /admin dan role bukan admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    // Redirect ke dashboard (atau halaman login jika belum login)
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Opsional: jika role admin mencoba akses /dashboard, redirect ke /admin
  if (pathname.startsWith('/dashboard') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi middleware hanya berjalan pada rute tertentu
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};