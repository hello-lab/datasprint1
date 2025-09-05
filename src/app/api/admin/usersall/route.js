import { sqrt } from '@tensorflow/tfjs-core';
import db from '../../../db/db';
import stepDb from '../../../db/stepDb';
import transactionDb from '../../../db/transactionDb';

export async function GET(request) {
  try {
    // Get all users
    const users = db.prepare('SELECT * FROM users').all();
    // Get user steps data - latest for each user
    const userSteps = stepDb.prepare(`
      SELECT user_name, user_email, MAX(steps) as max_steps, COUNT(*) as days_logged
      FROM user_steps 
      GROUP BY user_name
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
    console.log(users)
    const combinedData = users.map(user => {
      const steps = userSteps.find(s => s.user_name === user.username) || {};
      const transactions = userTransactions.find(t => t.userId === user.username) || {};
      return {
        id: user.id,
        username: user.username,
        balance: user.balance,
        max_steps: steps.max_steps || 0,
        days_logged: steps.days_logged || 0,
        email: user.email || '',
        total_transactions: transactions.total_transactions || 0,
        total_deposits: transactions.total_deposits || 0,
        total_withdrawals: transactions.total_withdrawals || 0,
        team: user.team || '',
        stepcount: user.stepcount ,
        squatcount: user.squat ,
        pushupcount: user.pushup ,
      };
    });
    // Convert combinedData to CSV
    const csvHeaders = [
      'id', 'username', 'balance', 'transactions', 'password', 'email', 'team', 'stepcount', 'pushup', 'squat'
    ];
    const csvRows = [
      csvHeaders.join(','), // header row
      ...combinedData.map(user =>
        csvHeaders.map(h => `"${(user[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users.csv"'
      },
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
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

