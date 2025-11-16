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
    admob_app_id TEXT,
    admob_banner_unit_id TEXT,
    admob_interstitial_unit_id TEXT,
    admob_native_unit_id TEXT,
    interstitial_interval INTEGER DEFAULT 3,
    native_ad_interval INTEGER DEFAULT 10,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO admin (id, username, password, email, full_name, user_role) 
VALUES (1, 'admin', '$2a$10$rZ9qX5YhV4kqL6jEZxXKxeGP0XN0YXxH5U8qHPmY7LKzH9YN0YN0Y', 'admin@recipeapp.com', 'Administrator', '100');

-- Insert default settings
INSERT OR IGNORE INTO settings (id, app_name, api_key, package_name) 
VALUES (1, 'Recipe App', 'your-api-key-here', 'com.app.yourrecipeapp');

-- Insert default ads config
INSERT OR IGNORE INTO ads_config (id) VALUES (1);

-- Insert sample categories
INSERT OR IGNORE INTO category (id, name) VALUES 
(1, 'Drink'),
(2, 'Desserts'),
(3, 'Side Dish'),
(4, 'Main Dish'),
(5, 'Breakfast'),
(6, 'Appetizers');
