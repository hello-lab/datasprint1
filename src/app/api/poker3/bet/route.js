import db from '../../../db/db.js';
import crashBetsDb from '../../../db/poker1.js';
import { verifyToken } from '../../../utils/auth.js';

export async function POST(req, res) {
    if (req.method === 'POST') {
        const { betAmount, gameid,winbet,type } = await req.json();
        console.log(betAmount, gameid,winbet,type);
        if(!betAmount||!gameid||!winbet){
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

                if (betAmount > user.balance) {
                    return new Response(JSON.stringify({ error: 'Bet amount exceeds account balance' }), {
                        status: 402,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }

                

                crashBetsDb.prepare('INSERT INTO poker3 (userId, betAmount, gameid,bet,type) VALUES (?, ?, ?,?,?)')
                    .run(userr.username, betAmount, gameid,winbet,type);

                
                    const res2 = await fetch(process.env.url+'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: userr.username, amount: betAmount, type: 'withdraw',remarks:'Poker3 Bet' })
        
                    });
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