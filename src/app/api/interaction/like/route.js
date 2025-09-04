import socialDb from '../../../db/socialmediaDb';
// POST: Toggle like for a post by username
export async function POST(request) {
  try {
    const { id, username } = await request.json();
    if (!id || !username) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id or username' }), { status: 400 });
    }
    // Fetch current likes
    const stmt = socialDb.prepare('SELECT likes FROM socials WHERE id = ?');
    const row = stmt.get(id);
    let likesArr = [];
    if (row && row.likes) {
      try {
        likesArr = JSON.parse(row.likes);
        if (!Array.isArray(likesArr)) likesArr = [];
      } catch {
        likesArr = [];
      }
    }
    // Toggle like
    const idx = likesArr.indexOf(username);
    if (idx === -1) {
      likesArr.push(username);
    } else {
      likesArr.splice(idx, 1);
    }
    // Update DB
    const updateStmt = socialDb.prepare('UPDATE socials SET likes = ? WHERE id = ?');
    updateStmt.run(JSON.stringify(likesArr), id);
    return new Response(JSON.stringify({ success: true, likes: likesArr }), { status: 200 });
  } catch (error) {
    console.error('POST /api/interaction/like error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

// GET: Return total number of likes for a post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });
    }
    const stmt = socialDb.prepare('SELECT likes FROM socials WHERE id = ?');
    const row = stmt.get(id);
    let likesArr = [];
    if (row && row.likes) {
      try {
        likesArr = JSON.parse(row.likes);
        if (!Array.isArray(likesArr)) likesArr = [];
      } catch {
        likesArr = [];
      }
    }
    return new Response(JSON.stringify({ likes: likesArr.length }), { status: 200 });
  } catch (error) {
    console.error('GET /api/interaction/like error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
