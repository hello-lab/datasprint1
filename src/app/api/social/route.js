import socialDb from '../../db/socialmediaDb';

export async function POST(request) {
  try {
    const { name, comments, likes, user_name, content, image_url } = await request.json();
    const stmt = socialDb.prepare(`
      INSERT INTO socials (name, comments, likes, user_name, content, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(name, comments, likes, user_name, content, image_url);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('POST /api/social error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    let posts;
    if (id) {
      const stmt = socialDb.prepare('SELECT * FROM socials WHERE id = ?');
      const post = stmt.get(id);
      posts = post ? [post] : [];
    } else {
      const stmt = socialDb.prepare('SELECT * FROM socials');
      posts = stmt.all();
    }
    return new Response(JSON.stringify(Array.isArray(posts) ? posts : []), { status: 200 });
  } catch (error) {
    console.error('GET /api/social error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
