import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Define routes that should be protected by Clerk normally
// Adjust this matcher if Clerk should protect other routes besides /app
const isClerkProtectedRoute = createRouteMatcher([
  '/app/(.*)', // Protect everything under /app by default
  // Add other Clerk-protected routes here if needed
]);

// Define public routes (including our auth flow)
const isPublicRoute = createRouteMatcher([
    '/', // Example: Landing page
    '/auth/(.*)', // Our OTP auth routes
    '/api/(.*)', // Assume external APIs are handled differently or public
    '/api/auth/create-user', // Public API? Or should be protected? Adjust as needed.
    // Add other public routes/APIs
]);


export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const token = url.searchParams.get('token');
    const isAsset = pathname.includes('.') || pathname.startsWith('/_next'); // Basic asset check

    // Skip middleware for static assets and Next.js internals
    if (isAsset) {
        return NextResponse.next();
    }

    // --- Custom Invite Token Logic ---
    // Check if it's a path under /app AND has a token parameter
    if (pathname.startsWith('/app/') && token) {
        // It's an invite link trying to access a protected area directly.
        // Redirect to the OTP request page, passing the token and the original target path.
        const redirectUrl = new URL('/auth/request-otp', req.url); // Use req.url to keep the base origin
        redirectUrl.searchParams.set('token', token);
        // Set redirectUrl to the path the user *intended* to visit AFTER login
        redirectUrl.searchParams.set('redirectUrl', pathname); // e.g., /app/rfq

        console.log(`Invite link detected for ${pathname}. Redirecting to OTP request.`);
        return NextResponse.redirect(redirectUrl);
    }
    // --- End Custom Invite Token Logic ---


    // --- Clerk Authentication ---
    // Apply Clerk middleware only to non-public routes that aren't the specific invite link pattern we just handled
    if (!isPublicRoute(req) && !pathname.startsWith('/app/') && !token) { // Added check to ensure Clerk runs if not public AND not the invite link
        console.log(`Applying Clerk middleware to: ${pathname}`);
         // If we reach here for an /app route without a token, Clerk should handle it
         // Or, if you want Clerk to handle *all* non-public routes:
         // return clerkMiddleware({})(req, null as any); // Pass req, ignore event argument

         // Using clerkMiddleware directly might be simpler if it handles auth correctly
         // return clerkMiddleware({ afterAuth: (auth, req) => {
         //     if (!auth.userId && !isPublicRoute(req)) {
         //         // Redirect non-authenticated users trying to access protected routes
         //         const signInUrl = new URL('/sign-in', req.url); // Adjust to your Clerk sign-in URL
         //         signInUrl.searchParams.set('redirect_url', req.url);
         //         return NextResponse.redirect(signInUrl);
         //     }
         //     return NextResponse.next();
         // } })(req, null as any);

         // Let's try the simpler direct call first, assuming Clerk protects non-public routes
         const clerkAuth = clerkMiddleware({});
         return clerkAuth(req, {} as any); // Call Clerk middleware
    }

    // Allow request to proceed for public routes or if handled above
    console.log(`Allowing public or handled route: ${pathname}`);
    return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (Clerk example includes this)
    // '/(api|trpc)(.*)', // Keep if needed, but ensure public APIs are handled
  ],
};