import adminDb from '../../../../db/adminDb';
import { hashPassword, comparePassword, generateAdminToken } from '../../../../utils/adminAuth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username and password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if admin user exists
    const admin = adminDb.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    
    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);
    
    if (!isPasswordValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update last login
    adminDb.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

    // Generate token
    const token = generateAdminToken(admin);

    const response = new Response(JSON.stringify({
      success: true,
      message: 'Login successful'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Set admin token as httpOnly cookie
    response.headers.set('Set-Cookie', `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}