// API endpoint for individual recipe operations

// GET single recipe
export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    const id = context.params.id;
    
    const recipe = await DB.prepare(`
      SELECT 
        r.*,
        c.name as category_name
      FROM recipe r
      LEFT JOIN category c ON r.category_id = c.id
      WHERE r.id = ?
    `).bind(id).first();

    if (!recipe) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Recipe not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: recipe
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

// PUT - Update recipe
export async function onRequestPut(context: any) {
  try {
    const { DB } = context.env;
    const id = context.params.id;
    const body = await context.request.json();
    
    const { category_id, title, cook_time, description, image_url, video_url, featured, tags } = body;

    await DB.prepare(`
      UPDATE recipe 
      SET category_id = ?,
          title = ?,
          cook_time = ?,
          description = ?,
          image_url = ?,
          video_url = ?,
          featured = ?,
          tags = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      category_id,
      title,
      cook_time || '',
      description,
      image_url || '',
      video_url || '',
      featured || 0,
      tags || '',
      id
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Recipe updated successfully'
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

// DELETE recipe
export async function onRequestDelete(context: any) {
  try {
    const { DB } = context.env;
    const id = context.params.id;

    await DB.prepare('DELETE FROM recipe WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Recipe deleted successfully'
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
