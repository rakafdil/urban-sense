import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Biarkan semua request lolos dulu
  return NextResponse.next()
}

export const config = {
  matcher: [], // kosongkan
}