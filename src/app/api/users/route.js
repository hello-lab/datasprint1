import db from '../../db/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('name');
  if (!username) {
    return new Response(JSON.stringify({ error: 'Missing username' }), { status: 400 });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    // Remove sensitive fields
    const { balance, transactions, password, ...safeUser } = user;
    return new Response(JSON.stringify(safeUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


