// Type definitions for the Recipe Admin Panel

export interface Admin {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  user_role: '100' | '101' | '102';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  category_id: number;
  title: string;
  cook_time?: string;
  description: string;
  image_url?: string;
  video_url?: string;
  video_id?: string;
  content_type: 'post' | 'youtube';
  featured: number;
  tags?: string;
  total_views: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeGallery {
  id: number;
  recipe_id: number;
  image_url: string;
  created_at: string;
}

export interface Settings {
  id: number;
  app_name: string;
  api_key: string;
  package_name: string;
  youtube_api_key?: string;
  fcm_server_key?: string;
  onesignal_app_id?: string;
  privacy_policy?: string;
  more_apps_url?: string;
  updated_at: string;
}

export interface AdsConfig {
  id: number;
  ad_status: string;
  ad_type: string;
  admob_app_id?: string;
  admob_banner_unit_id?: string;
  admob_interstitial_unit_id?: string;
  admob_native_unit_id?: string;
  interstitial_interval: number;
  native_ad_interval: number;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  image_url?: string;
  link?: string;
  sent_at?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
