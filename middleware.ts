import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const sessionCartId = request.cookies.get('sessionCartId');

    if (!sessionCartId) {
        const newCartId = crypto.randomUUID();
        response.cookies.set('sessionCartId', newCartId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 jours
        });
    }

    return response;
}
