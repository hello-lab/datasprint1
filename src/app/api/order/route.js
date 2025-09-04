import db from '../../db/orderDb'
import { NextResponse } from 'next/server';

// Mock transaction API call

export async function POST(request) {
    const { user, amount, type, remarks } = await request.json();

    const res = await fetch('http://'+request.headers.get('host')+'/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, amount, type, remarks }),
    });
    if (res.ok) {
           const stmt=db.prepare('INSERT INTO orders (username, orders) VALUES (?, ?);');

    try {
        stmt.run(user, remarks);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
    } else {
        return NextResponse.json({ success: false, error: 'Transaction failed' }, { status: 400 });
    }
}
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    let rows;
    if (username && username.trim() !== '') {
        const stmt = db.prepare('SELECT * FROM orders WHERE username = ?');
        rows = stmt.all(username);
    } else {
        const stmt = db.prepare('SELECT * FROM orders');
        rows = stmt.all();
    }

    return NextResponse.json({ orders: rows }, { status: 200 });
}