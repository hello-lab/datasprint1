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
    console.log(url)
    
    // Handle admin routes separately
    if (url && url.startsWith('/admin')) {
        // Allow access to admin login page without authentication
        if (url === '/admin') {
            return NextResponse.next();
        }
        
        // For admin dashboard and other admin routes, check admin authentication
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
        
        try {
            const adminPayload = await jwtVerify(adminToken.value, adminSecretKey);
            if (adminPayload.payload.type !== 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    }
    
    if (!url&&token){

        try {
            
            await jwtVerify(token.value, secretKey);
           
                return NextResponse.redirect(new URL('/app/home', req.url));
           
        } catch (error) {
          //  console.log(error);
        }
    
    
    }
    if (allowedsites.indexOf(url)==-1)
        {
            if (!token) {
      //  console.log('1')
       return NextResponse.redirect(new URL('/', req.url));
        
    }

    try {
       
        await jwtVerify(token.value, secretKey);
        if (!url)
            return NextResponse.redirect(new URL('/app/home', req.url));
        return NextResponse.next();
    } catch (error) {
      //  console.log(error);
       return NextResponse.redirect(new URL('/', req.url));
    }}
}

export const config = {
    matcher: ['/app/:path*','/','/admin/:path*'],
};
