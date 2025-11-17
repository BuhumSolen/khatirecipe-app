-- Cloudflare D1 Database Schema for Recipe Admin Panel

-- Admin users table
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    user_role TEXT NOT NULL CHECK(user_role IN ('100', '101', '102')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    cook_time TEXT,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    video_id TEXT,
    content_type TEXT CHECK(content_type IN ('post', 'youtube')),
    featured INTEGER DEFAULT 0,
    tags TEXT,
    total_views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

-- Recipe gallery table
CREATE TABLE IF NOT EXISTS recipe_gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    app_name TEXT NOT NULL DEFAULT 'Recipe App',
    api_key TEXT NOT NULL,
    package_name TEXT NOT NULL,
    youtube_api_key TEXT,
    fcm_server_key TEXT,
    onesignal_app_id TEXT,
    privacy_policy TEXT,
    more_apps_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ads configuration table
CREATE TABLE IF NOT EXISTS ads_config (
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

-- Ads placement table
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

-- Notifications table
CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    link TEXT,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Angvaiti@1)
INSERT OR IGNORE INTO admin (id, username, password, email, full_name, user_role) 
VALUES (1, 'buhumsolen', '$2b$10$Q9mymwbeBmUPvCqNsko4C.arlhWgzPlx9TbsRkAYR/up3RK.FavNS', 'buhumsolen@recipeapp.com', 'Buhum Solen', '100');

-- Insert default settings
INSERT OR IGNORE INTO settings (id, app_name, api_key, package_name) 
VALUES (1, 'Recipe App', 'your-api-key-here', 'com.app.yourrecipeapp');

-- Insert default ads config
INSERT OR IGNORE INTO ads_config (id) VALUES (1);

-- Insert default ads placement
INSERT OR IGNORE INTO ads_placement (id) VALUES (1);

-- Insert sample categories
INSERT OR IGNORE INTO category (id, name) VALUES 
(1, 'Drink'),
(2, 'Desserts'),
(3, 'Side Dish'),
(4, 'Main Dish'),
(5, 'Breakfast'),
(6, 'Appetizers');
