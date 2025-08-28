export async function POST(request) {
  try {
    const response = new Response(JSON.stringify({
      success: true,
      message: 'Logout successful'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Clear admin token cookie
    response.headers.set('Set-Cookie', `admin_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);

    return response;

  } catch (error) {
    console.error('Admin logout error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}