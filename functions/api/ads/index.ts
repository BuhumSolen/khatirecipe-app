// Ads management API endpoint

export async function onRequestGet(context: any) {
  try {
    const { DB } = context.env;

    const ads = await DB.prepare(`
      SELECT * FROM ads_config WHERE id = 1
    `).first();

    const placement = await DB.prepare(`
      SELECT * FROM ads_placement WHERE id = 1
    `).first();

    if (!ads) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Ads configuration not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: ads,
      placement: placement
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

export async function onRequestPut(context: any) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();

    // Update ads config
    const updateAds = await DB.prepare(`
      UPDATE ads_config SET
        ad_status = ?,
        ad_type = ?,
        backup_ads = ?,
        admob_publisher_id = ?,
        admob_app_id = ?,
        admob_banner_unit_id = ?,
        admob_interstitial_unit_id = ?,
        admob_native_unit_id = ?,
        admob_app_open_ad_unit_id = ?,
        ad_manager_banner_unit_id = ?,
        ad_manager_interstitial_unit_id = ?,
        ad_manager_native_unit_id = ?,
        ad_manager_app_open_ad_unit_id = ?,
        fan_banner_unit_id = ?,
        fan_interstitial_unit_id = ?,
        fan_native_unit_id = ?,
        startapp_app_id = ?,
        unity_game_id = ?,
        unity_banner_placement_id = ?,
        unity_interstitial_placement_id = ?,
        applovin_banner_ad_unit_id = ?,
        applovin_interstitial_ad_unit_id = ?,
        applovin_native_ad_manual_unit_id = ?,
        applovin_app_open_ad_unit_id = ?,
        applovin_banner_zone_id = ?,
        applovin_banner_mrec_zone_id = ?,
        applovin_interstitial_zone_id = ?,
        ironsource_app_key = ?,
        ironsource_banner_placement_name = ?,
        ironsource_interstitial_placement_name = ?,
        wortise_app_id = ?,
        wortise_banner_unit_id = ?,
        wortise_interstitial_unit_id = ?,
        wortise_native_unit_id = ?,
        wortise_app_open_unit_id = ?,
        interstitial_ad_interval = ?,
        native_ad_interval = ?,
        native_ad_index = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      body.ad_status || 'on',
      body.ad_type || 'admob',
      body.backup_ads || 'none',
      body.admob_publisher_id || '0',
      body.admob_app_id || '0',
      body.admob_banner_unit_id || '0',
      body.admob_interstitial_unit_id || '0',
      body.admob_native_unit_id || '0',
      body.admob_app_open_ad_unit_id || '0',
      body.ad_manager_banner_unit_id || '/6499/example/banner',
      body.ad_manager_interstitial_unit_id || '/6499/example/interstitial',
      body.ad_manager_native_unit_id || '/6499/example/native',
      body.ad_manager_app_open_ad_unit_id || '/6499/example/app-open',
      body.fan_banner_unit_id || '0',
      body.fan_interstitial_unit_id || '0',
      body.fan_native_unit_id || '0',
      body.startapp_app_id || '0',
      body.unity_game_id || '0',
      body.unity_banner_placement_id || 'banner',
      body.unity_interstitial_placement_id || 'video',
      body.applovin_banner_ad_unit_id || '0',
      body.applovin_interstitial_ad_unit_id || '0',
      body.applovin_native_ad_manual_unit_id || '0',
      body.applovin_app_open_ad_unit_id || '0',
      body.applovin_banner_zone_id || '0',
      body.applovin_banner_mrec_zone_id || '0',
      body.applovin_interstitial_zone_id || '0',
      body.ironsource_app_key || '85460dcd',
      body.ironsource_banner_placement_name || 'DefaultBanner',
      body.ironsource_interstitial_placement_name || 'DefaultInterstitial',
      body.wortise_app_id || 'test-app-id',
      body.wortise_banner_unit_id || 'test-banner',
      body.wortise_interstitial_unit_id || 'test-interstitial',
      body.wortise_native_unit_id || 'test-native',
      body.wortise_app_open_unit_id || 'test-app-open',
      body.interstitial_ad_interval || 3,
      body.native_ad_interval || 10,
      body.native_ad_index || 4
    ).run();

    // Update ads placement if provided
    if (body.placement) {
      await DB.prepare(`
        UPDATE ads_placement SET
          banner_home = ?,
          banner_post_details = ?,
          banner_category_details = ?,
          banner_search = ?,
          interstitial_post_list = ?,
          interstitial_post_details = ?,
          native_ad_home = ?,
          native_ad_post_list = ?,
          native_ad_post_details = ?,
          native_ad_exit_dialog = ?,
          app_open_ad_on_start = ?,
          app_open_ad_on_resume = ?
        WHERE id = 1
      `).bind(
        body.placement.banner_home !== undefined ? body.placement.banner_home : 1,
        body.placement.banner_post_details !== undefined ? body.placement.banner_post_details : 1,
        body.placement.banner_category_details !== undefined ? body.placement.banner_category_details : 1,
        body.placement.banner_search !== undefined ? body.placement.banner_search : 1,
        body.placement.interstitial_post_list !== undefined ? body.placement.interstitial_post_list : 1,
        body.placement.interstitial_post_details !== undefined ? body.placement.interstitial_post_details : 1,
        body.placement.native_ad_home !== undefined ? body.placement.native_ad_home : 1,
        body.placement.native_ad_post_list !== undefined ? body.placement.native_ad_post_list : 1,
        body.placement.native_ad_post_details !== undefined ? body.placement.native_ad_post_details : 1,
        body.placement.native_ad_exit_dialog !== undefined ? body.placement.native_ad_exit_dialog : 1,
        body.placement.app_open_ad_on_start !== undefined ? body.placement.app_open_ad_on_start : 1,
        body.placement.app_open_ad_on_resume !== undefined ? body.placement.app_open_ad_on_resume : 1
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Changes saved successfully'
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
