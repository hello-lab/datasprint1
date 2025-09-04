import  challengesDb  from '../../db/challengesDb';

export async function POST(request) {
    const data = await request.json();
    const {
        title,
        type,
        name,
        steps = 0,
        squats = 0,
        pushups = 0,
        winbonus = 0,
        deadline
    } = data;

    // Insert challenge into the database
    const stmt = challengesDb.prepare(`
        INSERT INTO challenges (title, type, name, steps, squats, pushups, winbonus, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        stmt.run(title, type, name, steps, squats, pushups, winbonus, deadline);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const stmt = challengesDb.prepare('SELECT * FROM challenges');
        const challenges = stmt.all();
        return new Response(JSON.stringify(challenges), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}