// API endpoint for categories

// GET all categories
export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    
    const { results } = await DB.prepare(`
      SELECT * FROM category ORDER BY name ASC
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

// POST - Create new category
export async function onRequestPost(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { name, image_url } = body;

    const result = await DB.prepare(`
      INSERT INTO category (name, image_url)
      VALUES (?, ?)
    `).bind(name, image_url || '').run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Category created successfully',
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
