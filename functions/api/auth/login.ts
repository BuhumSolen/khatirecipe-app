// Authentication endpoint
import bcrypt from 'bcryptjs';

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

    // Verify password with bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    
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
