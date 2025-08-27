import db from '../../../db/db.js';
import crashBetsDb from '../../../db/poker1.js';
import { verifyToken } from '../../../utils/auth.js';

export async function POST(req, res) {
    if (req.method === 'POST') {
        const { gameid} = await req.json();
       
        try {
           
         

            try {
                
            

                let users=crashBetsDb.prepare('SELECT *  FROM poker1 where gameid= ?').all(gameid);
                   

                
                 
                return new Response(JSON.stringify(users), {
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