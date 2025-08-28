import goalsDb from '../../db/goalsDb';
import stepDb from '../../db/stepDb';

// Create or update wellness goals
export async function POST(request) {
  try {
    const { userEmail, userName, goalType, targetValue } = await request.json();

    if (!userEmail || !userName || !goalType || !targetValue) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate date ranges based on goal type
    const now = new Date();
    let startDate, endDate;

    switch (goalType) {
      case 'daily_steps':
        startDate = now.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'weekly_steps':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = startOfWeek.toISOString().split('T')[0];
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endDate = endOfWeek.toISOString().split('T')[0];
        break;
      case 'monthly_steps':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid goal type'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // Check if user already has an active goal of this type
    const existingGoal = goalsDb.prepare(`
      SELECT * FROM user_goals 
      WHERE user_email = ? AND goal_type = ? AND status = 'active'
    `).get(userEmail, goalType);

    if (existingGoal) {
      // Update existing goal
      goalsDb.prepare(`
        UPDATE user_goals 
        SET target_value = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(targetValue, existingGoal.id);

      return new Response(JSON.stringify({
        success: true,
        message: `${goalType.replace('_', ' ')} goal updated successfully!`,
        goalId: existingGoal.id
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Create new goal
      const result = goalsDb.prepare(`
        INSERT INTO user_goals (user_email, user_name, goal_type, target_value, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userEmail, userName, goalType, targetValue, startDate, endDate);

      return new Response(JSON.stringify({
        success: true,
        message: `${goalType.replace('_', ' ')} goal created successfully!`,
        goalId: result.lastInsertRowid
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error creating goal:', error);
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

// Get user goals with progress
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail');

    if (!userEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User email required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all user goals
    const goals = goalsDb.prepare(`
      SELECT * FROM user_goals 
      WHERE user_email = ? 
      ORDER BY created_at DESC
    `).all(userEmail);

    // Calculate current progress for each goal
    const goalsWithProgress = goals.map(goal => {
      let currentValue = 0;
      
      try {
        if (goal.goal_type === 'daily_steps') {
          const stepData = stepDb.prepare(`
            SELECT steps FROM user_steps 
            WHERE user_email = ? AND date = ?
          `).get(userEmail, goal.start_date);
          currentValue = stepData?.steps || 0;
        } else if (goal.goal_type === 'weekly_steps') {
          const stepData = stepDb.prepare(`
            SELECT SUM(steps) as total_steps FROM user_steps 
            WHERE user_email = ? AND date >= ? AND date <= ?
          `).get(userEmail, goal.start_date, goal.end_date);
          currentValue = stepData?.total_steps || 0;
        } else if (goal.goal_type === 'monthly_steps') {
          const stepData = stepDb.prepare(`
            SELECT SUM(steps) as total_steps FROM user_steps 
            WHERE user_email = ? AND date >= ? AND date <= ?
          `).get(userEmail, goal.start_date, goal.end_date);
          currentValue = stepData?.total_steps || 0;
        }

        // Update current value in database
        goalsDb.prepare(`
          UPDATE user_goals 
          SET current_value = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(currentValue, goal.id);

        // Check if goal is completed
        if (currentValue >= goal.target_value && goal.status === 'active') {
          goalsDb.prepare(`
            UPDATE user_goals 
            SET status = 'completed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(goal.id);
          goal.status = 'completed';
        }

      } catch (error) {
        console.error('Error calculating goal progress:', error);
      }

      return {
        ...goal,
        current_value: currentValue,
        progress_percentage: Math.min(Math.round((currentValue / goal.target_value) * 100), 100)
      };
    });

    return new Response(JSON.stringify({
      success: true,
      goals: goalsWithProgress
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching goals:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Delete a goal
export async function DELETE(request) {
  try {
    const { goalId } = await request.json();

    if (!goalId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Goal ID required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    goalsDb.prepare('DELETE FROM user_goals WHERE id = ?').run(goalId);

    return new Response(JSON.stringify({
      success: true,
      message: 'Goal deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error deleting goal:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}