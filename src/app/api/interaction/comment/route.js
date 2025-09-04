import socialDb from '../../../db/socialmediaDb';

export async function POST(request) {
  try {
    const { id, username, comment } = await request.json();
    if (!id || !username || !comment) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id, username, or comment' }), { status: 400 });
    }
    // Fetch current comments
    const post = socialDb.prepare('SELECT comments FROM socials WHERE id = ?').get(id);
    let commentsArr = [];
    if (post && post.comments) {
      try {
        commentsArr = JSON.parse(post.comments);
        if (!Array.isArray(commentsArr)) commentsArr = [];
      } catch {
        commentsArr = [];
      }
    }
    // Add new comment
    commentsArr.push({ username, comment, date: new Date().toISOString() });
    const newCommentsStr = JSON.stringify(commentsArr);
    // Update DB
    const stmt = socialDb.prepare('UPDATE socials SET comments = ? WHERE id = ?');
    stmt.run(newCommentsStr, id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ comments: [] }), { status: 200 });
    }
    const post = socialDb.prepare('SELECT comments FROM socials WHERE id = ?').get(id);
    let commentsArr = [];
    if (post && post.comments) {
      try {
        commentsArr = JSON.parse(post.comments);
        if (!Array.isArray(commentsArr)) commentsArr = [];
      } catch {
        commentsArr = [];
      }
    }
    return new Response(JSON.stringify({ comments: commentsArr }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ comments: [] }), { status: 200 });
  }
}
