import { user } from '@heroui/react';
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
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const teamname = searchParams.get('teamname');
        console.log(username, teamname);

        let challenges = [];

        if (!username && !teamname) {
            // Return all challenges if no arguments
            const stmt = challengesDb.prepare('SELECT * FROM challenges');
            challenges = stmt.all();
        } else {
            const stmtUser = challengesDb.prepare(`
                SELECT * FROM challenges
                WHERE name = ?
            `);
            challenges = challenges.concat(stmtUser.all(username));
            challenges = challenges.concat(stmtUser.all(teamname));
            challenges = challenges.concat(stmtUser.all('all'));

            //challenges = stmt.all(username, teamname);
        }
        return new Response(JSON.stringify(challenges), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}