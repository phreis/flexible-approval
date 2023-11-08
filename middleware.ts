import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/home', request.url))
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(
    'x-pathname',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/action/:path*'],
};
