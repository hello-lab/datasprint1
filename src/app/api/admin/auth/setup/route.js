import adminDb from '../../../../db/adminDb';
import { hashPassword } from '../../../../utils/adminAuth';

export async function POST(request) {
  try {
    const { username, password, email, setupKey } = await request.json();

    // Check if setup key is correct (for security)
    

    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username and password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if admin already exists
    const existingAdmin = adminDb.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
    
    if (existingAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Admin user already exists'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash password and create admin
    const hashedPassword = await hashPassword(password);
    
    const stmt = adminDb.prepare(`
      INSERT INTO admin_users (username, password, email) 
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(username, hashedPassword, email || null);

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin user created successfully',
      adminId: result.lastInsertRowid
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}