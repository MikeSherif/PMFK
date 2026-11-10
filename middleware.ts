import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname.startsWith('/connect')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  const isGuarded =
    pathname.startsWith('/connect') && !pathname.startsWith('/connect/login');

  if (isGuarded && !request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = '/connect/login';
    url.searchParams.set('next', pathname);
    const redirect = NextResponse.redirect(url);
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ['/connect/:path*'],
};
