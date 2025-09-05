import  challengesDb  from '../../db/claimDb.js';

export async function POST(req) {
    // Receive the id of the challenge in the request body
    const { id } = await req.json();
    const stmt=challengesDb.prepare('INSERT into  challenges SET clear = 1 WHERE id = ?');
    // Update the 'clear' attribute to true for the specified challenge by id
    
    try {
        stmt.run(id);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}