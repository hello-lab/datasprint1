import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const allowedsites=['', '/app/home','/app/soccer','/app/tennis','/app/tips','/app/cricket','/app/virtualsports','/app/googlefit','/app/leaderboard']

export async function middleware(req) {
    const token = req.cookies.get('token');
    const adminToken = req.cookies.get('admin_token');
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
    const adminSecretKey = new TextEncoder().encode(process.env.ADMIN_SECRET_KEY || process.env.SECRET_KEY + '_ADMIN');
    
    let url=req.url.split('/')
    url=(url.length)==5?'/'+req.url.split('/')[3]+'/'+req.url.split('/')[4]:req.url.split('/')[3]
    
    // Allow all /admin and /admin/* routes without redirect
    if (url && (url === 'admin' || url.startsWith('admin/') || url === '/admin' || url.startsWith('/admin/'))) {
        return NextResponse.next();
    }
    
    if (!url&&token){

        try {
            
            await jwtVerify(token.value, secretKey);
           
                return NextResponse.redirect(new URL('/app/home', req.url));
           
        } catch (error) {
            // Token invalid, continue to redirect logic
        }
    
    
    }
    if (allowedsites.indexOf(url)==-1)
        {
            if (!token) {
       return NextResponse.redirect(new URL('/', req.url));
        
    }

    try {
       
        await jwtVerify(token.value, secretKey);
        if (!url)
            return NextResponse.redirect(new URL('/app/home', req.url));
        return NextResponse.next();
    } catch (error) {
       return NextResponse.redirect(new URL('/', req.url));
    }}
}

export const config = {
    matcher: ['/app/:path*','/','/admin/:path*'],
};
