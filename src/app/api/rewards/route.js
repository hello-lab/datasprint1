import db from '../../db/db';
import stepDb from '../../db/stepDb';
import transactionDb from '../../db/transactionDb';

// Calculate stepcoins reward for steps taken
export async function POST(request) {
  try {
    const { userEmail, steps, userName } = await request.json();

    if (!userEmail || !steps || !userName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate stepcoins reward (1 stepcoin per 10 steps)
    const stepcoinsEarned = Math.floor(steps / 10);
    
    if (stepcoinsEarned <= 0) {
      return new Response(JSON.stringify({
        success: true,
        stepcoinsEarned: 0,
        message: 'Keep walking to earn stepcoins!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user by email (since Google Fit uses email)
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(userName);
    
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if reward was already given for today
    const today = new Date().toISOString().split('T')[0];
    const existingReward = transactionDb.prepare(`
      SELECT * FROM transactions 
      WHERE userId = ? AND type = 'step_reward' AND date LIKE ?
    `).get(userName, `${today}%`);

    if (existingReward) {
      return new Response(JSON.stringify({
        success: true,
        stepcoinsEarned: 0,
        message: 'Daily step reward already claimed!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update user balance
    const newBalance = user.balance + stepcoinsEarned;
    db.prepare('UPDATE users SET balance = ? WHERE username = ?')
      .run(newBalance, userName);

    // Record transaction
    transactionDb.prepare(`
      INSERT INTO transactions (userId, amount, type, date, remarks) 
      VALUES (?, ?, ?, ?, ?)
    `).run(
      userName, 
      stepcoinsEarned, 
      'step_reward', 
      new Date().toISOString(),
      `Daily step reward: ${steps} steps = ${stepcoinsEarned} stepcoins`
    );

    return new Response(JSON.stringify({
      success: true,
      stepcoinsEarned,
      newBalance,
      message: `Congratulations! You earned ${stepcoinsEarned} stepcoins for ${steps} steps!`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing step rewards:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Get reward statistics
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userName = url.searchParams.get('user');

    if (!userName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get total rewards earned
    const totalRewards = transactionDb.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_rewards,
             COUNT(*) as reward_days
      FROM transactions 
      WHERE userId = ? AND type = 'step_reward'
    `).get(userName);

    // Get recent rewards
    const recentRewards = transactionDb.prepare(`
      SELECT amount, date, remarks
      FROM transactions 
      WHERE userId = ? AND type = 'step_reward'
      ORDER BY date DESC
      LIMIT 7
    `).all(userName);

    return new Response(JSON.stringify({
      success: true,
      totalRewards: totalRewards.total_rewards,
      rewardDays: totalRewards.reward_days,
      recentRewards
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching reward stats:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}