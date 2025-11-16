// API endpoint to get all recipes
export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    
    const { results } = await DB.prepare(`
      SELECT 
        r.*,
        c.name as category_name
      FROM recipe r
      LEFT JOIN category c ON r.category_id = c.id
      ORDER BY r.created_at DESC
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

// API endpoint to create a new recipe
export async function onRequestPost(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { category_id, title, cook_time, description, image_url, video_url, content_type, featured, tags } = body;

    const result = await DB.prepare(`
      INSERT INTO recipe (category_id, title, cook_time, description, image_url, video_url, content_type, featured, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      category_id,
      title,
      cook_time || '',
      description,
      image_url || '',
      video_url || '',
      content_type || 'post',
      featured || 0,
      tags || ''
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Recipe created successfully',
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
