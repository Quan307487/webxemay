import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Chặn truy cập trang /lab trên production
    if (
        process.env.NODE_ENV === 'production' &&
        request.nextUrl.pathname.startsWith('/lab')
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/lab/:path*'],
};
