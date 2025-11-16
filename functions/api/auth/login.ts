// Authentication endpoint

export async function onRequestPost(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { username, password } = body;

    // Get user from database
    const user = await DB.prepare(`
      SELECT id, username, password, email, full_name, user_role
      FROM admin
      WHERE username = ?
    `).bind(username).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In production, you would verify password with bcrypt here
    // For now, we'll do a simple check (NOT SECURE - placeholder only)
    // const bcrypt = require('bcryptjs');
    // const valid = await bcrypt.compare(password, user.password);
    
    // Simplified auth - in production use proper bcrypt verification
    const validPassword = password === 'Angvaiti@1' && username === 'buhumsolen';
    
    if (!validPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return user data (without password)
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        user_role: user.user_role
      },
      message: 'Login successful'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
