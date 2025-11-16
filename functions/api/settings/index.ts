// API endpoint for settings

// GET settings
export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;
    
    const settings = await DB.prepare('SELECT * FROM settings WHERE id = 1').first();

    return new Response(JSON.stringify({
      success: true,
      data: settings || {}
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

// PUT - Update settings
export async function onRequestPut(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    
    const { app_name, api_key, package_name, privacy_policy_url, terms_url, about_text, email, version, more_apps_url, youtube_channel } = body;

    await DB.prepare(`
      UPDATE settings 
      SET app_name = ?,
          api_key = ?,
          package_name = ?,
          privacy_policy_url = ?,
          terms_url = ?,
          about_text = ?,
          email = ?,
          version = ?,
          more_apps_url = ?,
          youtube_channel = ?
      WHERE id = 1
    `).bind(
      app_name || '',
      api_key || '',
      package_name || '',
      privacy_policy_url || '',
      terms_url || '',
      about_text || '',
      email || '',
      version || '',
      more_apps_url || '',
      youtube_channel || ''
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Settings updated successfully'
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
