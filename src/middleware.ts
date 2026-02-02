
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('jwt')?.value;

        // Strict check: if no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Note: We cannot verify the JWT signature here easily without edge compatible libraries
        // or exposing the secret. The real security is in the API calls.
        // This middleware mainly prevents casual access to the UI.
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
