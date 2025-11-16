'use client';

import { ChefHat, BookOpen, FolderOpen, Settings, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalRecipes: number;
  totalCategories: number;
  totalViews: number;
  featuredRecipes: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRecipes: 0,
    totalCategories: 0,
    totalViews: 0,
    featuredRecipes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Recipe Admin</h1>
                <p className="text-sm text-gray-500">Cloudflare Edition</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalRecipes}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Recipes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalCategories}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Categories</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Featured</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.featuredRecipes}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Featured Recipes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalViews.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Views</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/dashboard/recipes"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <BookOpen className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Recipes</h3>
            <p className="text-gray-600">Add, edit, or delete recipes</p>
          </Link>

          <Link 
            href="/dashboard/categories"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <FolderOpen className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-gray-600">Organize recipe categories</p>
          </Link>

          <Link 
            href="/dashboard/notifications"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <Bell className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600">Send push notifications</p>
          </Link>

          <Link 
            href="/dashboard/settings"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <Settings className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Configure app settings</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
