import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoutes = createRouteMatcher(["/admin(.*)"]);


export default clerkMiddleware(async (auth, req: any) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const token = url.searchParams.get('token');
  const isAsset = pathname.includes('.') || pathname.startsWith('/_next');

  // Skip middleware for static assets and Next.js internals
  if (isAsset) {
    return NextResponse.next();
  }

  // Handle invite token logic
  if (pathname.startsWith('/app/') && token) {
    const redirectUrl = new URL('/auth/request-otp', req.url);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('redirectUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (protectedRoutes(req)) await auth.protect()


  return NextResponse.next();
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};