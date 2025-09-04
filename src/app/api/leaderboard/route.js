import stepDb from "../../db/stepDb"

export async function GET(request) {
  try {
    // Get today's date for filtering
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Query to get leaderboard data for today, ordered by steps (descending)
    const leaderboardQuery = stepDb.prepare(`
      SELECT 
        user_name,
        user_email,
        steps,
        date,
        created_at
      FROM user_steps 
      WHERE date = ?
      ORDER BY steps DESC
      LIMIT 50
    `);
    const usersRes = await fetch(`${request.nextUrl.origin}/api/admin/users`);
    const usersJson = await usersRes.json();
    const users = usersJson.users || [];

    const userTeamMap = {};
    users.forEach(user => {
      userTeamMap[user.user_name] = user.team_name;
    });
    const leaderboardData = leaderboardQuery.all(today);
    
    // Add ranking to the data
    const rankedData = leaderboardData.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    return new Response(JSON.stringify({ 
      success: true,
      date: today,
      leaderboard: rankedData,
      totalUsers: rankedData.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}