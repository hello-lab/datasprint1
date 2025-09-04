import pushupdb from '../../../db/squatDb';
import db from '../../../db/db';


export  async function POST(req, res) {
    if (req.method === 'POST') {
    const { user , squats  } = await req.json();
    let userr=""
    // Receive the id of the challenge in the request body
    const stmt=pushupdb.prepare('UPDATE user_squat SET squats = squats + ? WHERE user_name = ?');
    const stmt1=db.prepare('UPDATE users SET squat = squat + ? WHERE username = ?');// Update the 'clear' attribute to true for the specified challenge by id

    try {
        stmt.run(squats, user);
        stmt1.run(squats, user);
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