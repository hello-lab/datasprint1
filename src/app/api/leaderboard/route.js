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
        created_at,
        team
      FROM user_steps 
      WHERE date = ?
      ORDER BY steps DESC
      LIMIT 50
    `);
    const leaderboardQuerybyTeam = stepDb.prepare(`
      SELECT 
        
        
        SUM(steps) as steps,
        date,
        created_at,
        team
      FROM user_steps 
     
      WHERE date = ?
       GROUP BY team
      ORDER BY steps DESC
      
      LIMIT 50
    `);
   
    const leaderboardData = leaderboardQuery.all(today);
    const leaderboardDataTeam = leaderboardQuerybyTeam.all(today);
    // Add ranking to the data
    const rankedData = leaderboardData.map((user, index) => ({
      rank: index + 1,
      ...user
    }));
    const rankedDatabyTeam = leaderboardDataTeam.map((user, index) => ({
      rank: index + 1,
      ...user
    }))
    console.log(rankedDatabyTeam,"userdat")
    return new Response(JSON.stringify({ 
      success: true,
      date: today,
      leaderboard: rankedData,
      totalUsers: rankedData.length,
      leaderboardTeam:rankedDatabyTeam,
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