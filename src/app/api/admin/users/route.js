import db from '../../../db/db';
import stepDb from '../../../db/stepDb';
import transactionDb from '../../../db/transactionDb';
import { verifyAdminToken } from '../../../utils/adminAuth';

// Middleware to check admin authentication
function checkAdminAuth(request) {
  const adminToken = request.cookies.get('admin_token');
  
  if (!adminToken) {
    throw new Error('Admin authentication required');
  }

  try {
    const admin = verifyAdminToken(adminToken.value);
    return admin;
  } catch (error) {
    throw new Error('Invalid admin token');
  }
}

export async function GET(request) {
  try {
    // Check admin authentication
    checkAdminAuth(request);
    
    // Get all users
    const users = db.prepare('SELECT id, username, balance, stepcount FROM users').all();
    
    // Get user steps data - latest for each user
    const userSteps = stepDb.prepare(`
      SELECT user_name, user_email, MAX(steps) as max_steps, COUNT(*) as days_logged
      FROM user_steps 
      GROUP BY user_email
    `).all();
    
    // Get transaction summary for each user
    const userTransactions = transactionDb.prepare(`
      SELECT userId, 
             COUNT(*) as total_transactions,
             SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as total_deposits,
             SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END) as total_withdrawals
      FROM transactions 
      GROUP BY userId
    `).all();
    
    // Combine all data
    const combinedData = users.map(user => {
      const steps = userSteps.find(s => s.user_name === user.username) || {};
      const transactions = userTransactions.find(t => t.userId === user.username) || {};
      
      return {
        id: user.id,
        username: user.username,
        balance: user.balance,
        stepcount: user.stepcount,
        max_steps: steps.max_steps || 0,
        days_logged: steps.days_logged || 0,
        user_email: steps.user_email || '',
        total_transactions: transactions.total_transactions || 0,
        total_deposits: transactions.total_deposits || 0,
        total_withdrawals: transactions.total_withdrawals || 0
      };
    });

    return new Response(JSON.stringify({
      success: true,
      users: combinedData,
      total_users: combinedData.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching admin data:', error);
    
    // Check if it's an authentication error
    if (error.message === 'Admin authentication required' || error.message === 'Invalid admin token') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized',
        message: error.message
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
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

export async function PUT(request) {
  try {
    // Check admin authentication
    checkAdminAuth(request);
    
    const { id, updates } = await request.json();
    
    if (!id || !updates) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    if (updates.balance !== undefined) {
      updateFields.push('balance = ?');
      updateValues.push(updates.balance);
    }
    
    if (updates.stepcount !== undefined) {
      updateFields.push('stepcount = ?');
      updateValues.push(updates.stepcount);
    }
    
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No valid fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    updateValues.push(id);
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    const result = stmt.run(...updateValues);
    
    if (result.changes === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'User updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    // Check if it's an authentication error
    if (error.message === 'Admin authentication required' || error.message === 'Invalid admin token') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized',
        message: error.message
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
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