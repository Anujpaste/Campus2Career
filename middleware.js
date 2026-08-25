import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();

    if (!userId && isProtectedRoute(req)) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Clerk auth error:', error);
    // Fallback: Redirect to sign-in or a custom error page
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files (unless in search params)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
