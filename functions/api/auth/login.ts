// Authentication endpoint
import bcrypt from 'bcryptjs';

// Utility function for bcrypt comparison with timeout
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Add a timeout wrapper for bcrypt
    const comparePromise = bcrypt.compare(password, hash);
    const timeoutPromise = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('Bcrypt timeout')), 5000)
    );
    
    const result = await Promise.race([comparePromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error('Bcrypt error:', error);
    // Fallback: if bcrypt fails, do not authenticate
    return false;
  }
}

export async function onRequestPost(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username and password are required'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

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
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // Verify password with bcrypt (with timeout protection)
    const validPassword = await verifyPassword(password, user.password);
    
    if (!validPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
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
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Authentication failed. Please try again.'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
}
