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
        deadline,
        description = '',
        challenge_type = 'individual',
        target_teams = '',
        difficulty = 'medium',
        points = 100,
        created_by = 'user'
    } = data;

    // Insert challenge into the database
    const stmt = challengesDb.prepare(`
        INSERT INTO challenges (title, type, name, steps, squats, pushups, winbonus, deadline, description, challenge_type, target_teams, difficulty, points, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        const result = stmt.run(title, type, name, steps, squats, pushups, winbonus, deadline, description, challenge_type, target_teams, difficulty, points, created_by);
        return new Response(JSON.stringify({ 
            success: true, 
            challengeId: result.lastInsertRowid 
        }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const team = searchParams.get('team');
        const type = searchParams.get('type');
        const status = searchParams.get('status') || 'active';
        
        let query = 'SELECT * FROM challenges WHERE status = ?';
        let params = [status];
        
        if (team) {
            query += ' AND (target_teams = ? OR target_teams = "" OR target_teams IS NULL)';
            params.push(team);
        }
        
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const stmt = challengesDb.prepare(query);
        const challenges = stmt.all(...params);
        
        // Get participation data for each challenge
        const challengesWithParticipation = challenges.map(challenge => {
            const participationQuery = challengesDb.prepare(`
                SELECT 
                    COUNT(*) as total_participants,
                    COUNT(CASE WHEN completed = 1 THEN 1 END) as completed_count,
                    AVG(current_progress) as avg_progress
                FROM challenge_participants 
                WHERE challenge_id = ?
            `);
            
            const participation = participationQuery.get(challenge.id) || {
                total_participants: 0,
                completed_count: 0,
                avg_progress: 0
            };
            
            return {
                ...challenge,
                participation: {
                    totalParticipants: participation.total_participants,
                    completedCount: participation.completed_count,
                    averageProgress: Math.round(participation.avg_progress || 0),
                    completionRate: participation.total_participants > 0 ? 
                        Math.round((participation.completed_count / participation.total_participants) * 100) : 0
                }
            };
        });
        
        return new Response(JSON.stringify({
            success: true,
            challenges: challengesWithParticipation
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}