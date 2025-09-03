import { auth } from '@/auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const adsCrawlers = [
  /AdsBot-Google/i,              
  /AdsBot-Google-Mobile/i,       
  /AdsBot-Google-Mobile-Apps/i,  
  /Mediapartners-Google/i,       
  /Google-Display-Ads-Bot/i      
];


export default auth((req: NextRequest) => {

  const ua = req.headers.get('user-agent') || '';

  
  if (adsCrawlers.some(bot => bot.test(ua))) {
    console.warn(`✅ Site Loaded`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // auth() is invoked to check if the user is authenticated.
  // The authorized callback in auth.config.ts is NOT called when using this.
  // The return value of auth() is an object with the user's session, or null if they are not authenticated.
  // The request is not redirected.
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isOnDashboard = nextUrl.pathname.startsWith('/admin/dashboard');

  if (isOnDashboard) {
    if (isLoggedIn) return; // Allow access if logged in
    return Response.redirect(new URL('/admin/login', nextUrl)); // Redirect unauthenticated users to login page
  } else if (isLoggedIn) {
     if (nextUrl.pathname.startsWith('/admin/login')) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
     }
  }
  return NextResponse.next();
  // For any other case, we don't need to do anything.
  // The request will be handled by the corresponding route.
});
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/admin/dashboard/:path*', '/admin/login', '/((?!_next|api|static|favicon.ico).*)'],
};
