import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/server/auth.ts';

// Runs on Node.js (not the default Edge runtime) so it can use the same HMAC verification as the
// route handlers, with no duplicated crypto implementation between the two.
export const runtime = 'nodejs';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PUBLIC_API_PATHS = ['/api/admin/login'];

// The published site is the public menu only: it has no database, so the dashboard cannot work
// there and must not look like it is merely locked. It runs on the restaurant's own computer.
const ADMIN_ENABLED = process.env.NEXT_PUBLIC_ADMIN_ENABLED !== '0';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!ADMIN_ENABLED) {
    return new NextResponse('The Al Qadri admin dashboard runs on the restaurant computer, not on this site.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  if (PUBLIC_ADMIN_PATHS.includes(pathname) || PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySession(token);

  if (!session) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: this only checks the token's signature and expiry (fast, no DB access from
  // middleware). Every admin route handler additionally calls requireAdmin(), which re-checks
  // the token against the live admin_users row, so a credential change or deleted account still
  // takes effect immediately even though the cookie itself might still verify here.
  return NextResponse.next();
}
