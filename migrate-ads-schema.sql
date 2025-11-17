-- Migration: Add new ads management fields to existing tables

-- Drop existing ads_config table and recreate with new schema
DROP TABLE IF EXISTS ads_config;
CREATE TABLE ads_config (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    ad_status TEXT DEFAULT 'on',
    ad_type TEXT DEFAULT 'admob',
    backup_ads TEXT DEFAULT 'none',
    
    -- AdMob
    admob_publisher_id TEXT DEFAULT '0',
    admob_app_id TEXT DEFAULT '0',
    admob_banner_unit_id TEXT DEFAULT '0',
    admob_interstitial_unit_id TEXT DEFAULT '0',
    admob_native_unit_id TEXT DEFAULT '0',
    admob_app_open_ad_unit_id TEXT DEFAULT '0',
    
    -- Google Ad Manager
    ad_manager_banner_unit_id TEXT DEFAULT '/6499/example/banner',
    ad_manager_interstitial_unit_id TEXT DEFAULT '/6499/example/interstitial',
    ad_manager_native_unit_id TEXT DEFAULT '/6499/example/native',
    ad_manager_app_open_ad_unit_id TEXT DEFAULT '/6499/example/app-open',
    
    -- Meta Audience Network
    fan_banner_unit_id TEXT DEFAULT '0',
    fan_interstitial_unit_id TEXT DEFAULT '0',
    fan_native_unit_id TEXT DEFAULT '0',
    
    -- StartApp
    startapp_app_id TEXT DEFAULT '0',
    
    -- Unity Ads
    unity_game_id TEXT DEFAULT '0',
    unity_banner_placement_id TEXT DEFAULT 'banner',
    unity_interstitial_placement_id TEXT DEFAULT 'video',
    
    -- AppLovin MAX
    applovin_banner_ad_unit_id TEXT DEFAULT '0',
    applovin_interstitial_ad_unit_id TEXT DEFAULT '0',
    applovin_native_ad_manual_unit_id TEXT DEFAULT '0',
    applovin_app_open_ad_unit_id TEXT DEFAULT '0',
    
    -- AppLovin Discovery
    applovin_banner_zone_id TEXT DEFAULT '0',
    applovin_banner_mrec_zone_id TEXT DEFAULT '0',
    applovin_interstitial_zone_id TEXT DEFAULT '0',
    
    -- ironSource
    ironsource_app_key TEXT DEFAULT '85460dcd',
    ironsource_banner_placement_name TEXT DEFAULT 'DefaultBanner',
    ironsource_interstitial_placement_name TEXT DEFAULT 'DefaultInterstitial',
    
    -- Wortise
    wortise_app_id TEXT DEFAULT 'test-app-id',
    wortise_banner_unit_id TEXT DEFAULT 'test-banner',
    wortise_interstitial_unit_id TEXT DEFAULT 'test-interstitial',
    wortise_native_unit_id TEXT DEFAULT 'test-native',
    wortise_app_open_unit_id TEXT DEFAULT 'test-app-open',
    
    -- Global Settings
    interstitial_ad_interval INTEGER DEFAULT 3,
    native_ad_interval INTEGER DEFAULT 10,
    native_ad_index INTEGER DEFAULT 4,
    
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create ads_placement table
CREATE TABLE IF NOT EXISTS ads_placement (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    banner_home INTEGER DEFAULT 1,
    banner_post_details INTEGER DEFAULT 1,
    banner_category_details INTEGER DEFAULT 1,
    banner_search INTEGER DEFAULT 1,
    interstitial_post_list INTEGER DEFAULT 1,
    interstitial_post_details INTEGER DEFAULT 1,
    native_ad_home INTEGER DEFAULT 1,
    native_ad_post_list INTEGER DEFAULT 1,
    native_ad_post_details INTEGER DEFAULT 1,
    native_ad_exit_dialog INTEGER DEFAULT 1,
    app_open_ad_on_start INTEGER DEFAULT 1,
    app_open_ad_on_resume INTEGER DEFAULT 1
);

-- Insert default data
INSERT INTO ads_config (id) VALUES (1);
INSERT INTO ads_placement (id) VALUES (1);
