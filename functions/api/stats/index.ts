// Dashboard statistics endpoint

export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    
    // Get total recipes
    const recipesCount = await DB.prepare('SELECT COUNT(*) as count FROM recipe').first();
    
    // Get total categories
    const categoriesCount = await DB.prepare('SELECT COUNT(*) as count FROM category').first();
    
    // Get total views
    const totalViews = await DB.prepare('SELECT SUM(total_views) as total FROM recipe').first();
    
    // Get featured recipes count
    const featuredCount = await DB.prepare('SELECT COUNT(*) as count FROM recipe WHERE featured = 1').first();

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalRecipes: recipesCount.count || 0,
        totalCategories: categoriesCount.count || 0,
        totalViews: totalViews.total || 0,
        featuredRecipes: featuredCount.count || 0
      }
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
