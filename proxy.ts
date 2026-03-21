import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques — laisser passer
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}