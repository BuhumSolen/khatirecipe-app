import { ChefHat, Cloud, Database, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-2xl">
              <ChefHat className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Recipe Admin Panel
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Modern, serverless admin panel for your recipe app
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Powered by Cloudflare Pages, D1 Database & R2 Storage
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Login to Dashboard
            </Link>
            <a
              href="https://github.com/cloudflare/workers-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Cloud className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Serverless</h3>
            <p className="text-gray-600">
              Runs on Cloudflare's global edge network. No servers to manage.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Database className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">D1 Database</h3>
            <p className="text-gray-600">
              Fast SQLite database distributed globally at the edge.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with Next.js and optimized for performance.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Manage recipes with rich text descriptions and images
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Organize recipes by categories
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Configure app settings and advertisements
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Send push notifications to mobile app users
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Track recipe views and analytics
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              100% free hosting on Cloudflare Pages
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p>Migrated from PHP/MySQL to Cloudflare Pages</p>
          <p className="mt-2 text-sm">Modern • Serverless • Free</p>
        </div>
      </div>
    </div>
  );
}
