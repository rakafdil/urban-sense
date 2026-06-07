// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  // Ambil token dari cookie
  const token = request.cookies.get('cookie_token')?.value;
  let role: string | undefined;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      role = decoded.role; // role dari payload JWT
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const { pathname } = request.nextUrl;

  // Proteksi rute /admin: hanya admin yang boleh akses
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Opsional: redirect admin dari /dashboard ke /admin
  if (pathname.startsWith('/dashboard') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};