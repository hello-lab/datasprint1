import { NextResponse } from 'next/server';
import challengesDb from '../../db/challengesDb';
import stepDb from '../../db/stepDb';

// Join a challenge
export async function POST(req) {
  try {
    const { challengeId, userName, team } = await req.json();

    if (!challengeId || !userName || !team) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Check if user is already participating
    const existingQuery = challengesDb.prepare(`
      SELECT id FROM challenge_participants 
      WHERE challenge_id = ? AND user_name = ?
    `);
    
    const existing = existingQuery.get(challengeId, userName);
    
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Already participating in this challenge' 
      }, { status: 400 });
    }

    // Add user to challenge
    const insertQuery = challengesDb.prepare(`
      INSERT INTO challenge_participants (challenge_id, user_name, team)
      VALUES (?, ?, ?)
    `);
    
    insertQuery.run(challengeId, userName, team);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined challenge' 
    });

  } catch (error) {
    console.error('Error joining challenge:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to join challenge' 
    }, { status: 500 });
  }
}

// Update challenge progress
export async function PUT(req) {
  try {
    const { challengeId, userName, progress, type } = await req.json();

    if (!challengeId || !userName || progress === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get challenge details
    const challengeQuery = challengesDb.prepare(`
      SELECT * FROM challenges WHERE id = ?
    `);
    
    const challenge = challengeQuery.get(challengeId);
    
    if (!challenge) {
      return NextResponse.json({ 
        success: false, 
        error: 'Challenge not found' 
      }, { status: 404 });
    }

    // Calculate target based on challenge type
    let target = 0;
    if (type === 'steps' || challenge.type === 'steps') {
      target = challenge.steps;
    } else if (type === 'squats' || challenge.type === 'squats') {
      target = challenge.squats;
    } else if (type === 'pushups' || challenge.type === 'pushups') {
      target = challenge.pushups;
    }

    const completed = progress >= target;

    // Update participant progress
    const updateQuery = challengesDb.prepare(`
      UPDATE challenge_participants 
      SET current_progress = ?, completed = ?, completed_at = ?
      WHERE challenge_id = ? AND user_name = ?
    `);
    
    const completedAt = completed ? new Date().toISOString() : null;
    updateQuery.run(progress, completed ? 1 : 0, completedAt, challengeId, userName);

    return NextResponse.json({ 
      success: true, 
      completed,
      progress,
      target,
      percentComplete: Math.round((progress / target) * 100)
    });

  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update progress' 
    }, { status: 500 });
  }
}

// Get user's challenge participation
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get('userName');
    const team = searchParams.get('team');
    const challengeId = searchParams.get('challengeId');

    let query = `
      SELECT 
        cp.*,
        c.title,
        c.type,
        c.description,
        c.steps,
        c.squats,
        c.pushups,
        c.deadline,
        c.points,
        c.difficulty
      FROM challenge_participants cp
      JOIN challenges c ON cp.challenge_id = c.id
      WHERE 1=1
    `;
    
    let params = [];

    if (userName) {
      query += ' AND cp.user_name = ?';
      params.push(userName);
    }
    
    if (team) {
      query += ' AND cp.team = ?';
      params.push(team);
    }
    
    if (challengeId) {
      query += ' AND cp.challenge_id = ?';
      params.push(challengeId);
    }

    query += ' ORDER BY cp.created_at DESC';

    const stmt = challengesDb.prepare(query);
    const participations = stmt.all(...params);

    // Calculate progress percentages
    const participationsWithProgress = participations.map(p => {
      let target = 0;
      if (p.type === 'steps') target = p.steps;
      else if (p.type === 'squats') target = p.squats;
      else if (p.type === 'pushups') target = p.pushups;

      return {
        ...p,
        target,
        progressPercent: target > 0 ? Math.round((p.current_progress / target) * 100) : 0,
        daysRemaining: calculateDaysRemaining(p.deadline)
      };
    });

    return NextResponse.json({ 
      success: true, 
      participations: participationsWithProgress 
    });

  } catch (error) {
    console.error('Error fetching participations:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch participations' 
    }, { status: 500 });
  }
}

function calculateDaysRemaining(deadline) {
  if (!deadline) return null;
  
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}