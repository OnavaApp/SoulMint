// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = (request as any).geo?.country; // 👈 type-safe workaround

  if (country === 'US') {
    return NextResponse.redirect(new URL('/blocked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!blocked).*)'],
};