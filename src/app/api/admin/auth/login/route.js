import adminDb from '../../../../db/adminDb';

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

    // Simple check for admin credentials
    if (username === 'admin' && password === 'admin') {
      const response = new Response(JSON.stringify({
        success: true,
        message: 'Login successful'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

      // Set a dummy admin token as httpOnly cookie
      response.headers.set('Set-Cookie', `admin_token=dummy_token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);

      return response;
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid credentials'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });

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
