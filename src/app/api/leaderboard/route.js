import stepDb from "../../db/stepDb"
import transactionDb from "../../db/transactionDb"

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
    
    const leaderboardData = leaderboardQuery.all(today);
    
    // Get stepcoins earned today for each user
    const enrichedData = leaderboardData.map((user, index) => {
      // Get stepcoins earned today
      const stepcoinsToday = transactionDb.prepare(`
        SELECT COALESCE(SUM(amount), 0) as stepcoins_earned
        FROM transactions 
        WHERE userId = ? AND type = 'step_reward' AND date LIKE ?
      `).get(user.user_name, `${today}%`);

      return {
        rank: index + 1,
        ...user,
        stepcoins_earned: stepcoinsToday?.stepcoins_earned || 0
      };
    });

    return new Response(JSON.stringify({ 
      success: true,
      date: today,
      leaderboard: enrichedData,
      totalUsers: enrichedData.length
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