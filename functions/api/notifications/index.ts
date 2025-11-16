// API endpoint for notifications

// GET all notifications
export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    
    const { results } = await DB.prepare(`
      SELECT * FROM notification 
      ORDER BY created_at DESC
    `).all();

    return new Response(JSON.stringify({
      success: true,
      data: results
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

// POST - Create new notification
export async function onRequestPost(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { title, message, image_url, link } = body;

    const result = await DB.prepare(`
      INSERT INTO notification (title, message, image_url, link, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      title,
      message,
      image_url || '',
      link || ''
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Notification created successfully',
      id: result.meta.last_row_id
    }), {
      status: 201,
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
