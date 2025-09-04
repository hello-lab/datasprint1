import pushupdb from '../../../db/pushupDb';
import db from '../../../db/db';


export  async function POST(req, res) {
    if (req.method === 'POST') {
    const { user , pushups  } = await req.json();
    let userr=""
    // Receive the id of the challenge in the request body
    const stmt=pushupdb.prepare('UPDATE user_pushup SET pushups = pushups + ? WHERE user_name = ?');
    const stmt1=db.prepare('UPDATE users SET pushup = pushup + ? WHERE username = ?');// Update the 'clear' attribute to true for the specified challenge by id
    
    try {
        stmt.run(pushups, user);
        stmt1.run(pushups, user);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
    }}


export async function GET(request) {
    return new Response(JSON.stringify({ user: 'John Doe' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
  }