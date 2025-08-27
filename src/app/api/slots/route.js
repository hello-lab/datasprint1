import db from '../../../db/db.js';
import crashBetsDb from '../../../db/crashBetsDb.js';
import { verifyToken } from '@/app/utils/auth';

export async function POST(req, res) {
    if (req.method === 'POST') {
        const { betAmount, gameid } = await req.json();
        if(!betAmount||!gameid){
            return new Response(JSON.stringify({ error: 'Mising Creds' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        try {
            const token = req.cookies.getAll()[0].value;
            console.log(token);

            if (!token) return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });

            try {
                const userr = verifyToken(token);
                console.log(userr.username);

                const user = db.prepare("SELECT * FROM users WHERE username = ?").get(userr.username);
                let cardsa1=[1,2,3,4,5,6,7,8,9,10]
                
                return new Response(JSON.stringify({ message: 'Bet placed' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.log(error);
                return new Response(JSON.stringify({ error: 'Invalid token' }), {
                    status: 402,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } catch (err) {
            console.log(err);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(request) {
    return new Response(JSON.stringify({ user: 'John Doe' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}