'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings as SettingsIcon, Save, ChefHat } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    app_name: '',
    api_key: '',
    package_name: '',
    privacy_policy_url: '',
    terms_url: '',
    about_text: '',
    email: '',
    version: '',
    more_apps_url: '',
    youtube_channel: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success && data.data) {
        setFormData({
          app_name: data.data.app_name || '',
          api_key: data.data.api_key || '',
          package_name: data.data.package_name || '',
          privacy_policy_url: data.data.privacy_policy_url || '',
          terms_url: data.data.terms_url || '',
          about_text: data.data.about_text || '',
          email: data.data.email || '',
          version: data.data.version || '',
          more_apps_url: data.data.more_apps_url || '',
          youtube_channel: data.data.youtube_channel || ''
        });
      }
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">App Settings</h1>
                <p className="text-sm text-gray-500">Configure your application</p>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Settings */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="app_name" className="block text-sm font-medium text-gray-700 mb-2">
                      App Name
                    </label>
                    <input
                      id="app_name"
                      name="app_name"
                      type="text"
                      value={formData.app_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Recipe App"
                    />
                  </div>

                  <div>
                    <label htmlFor="package_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name
                    </label>
                    <input
                      id="package_name"
                      name="package_name"
                      type="text"
                      value={formData.package_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="com.yourapp.recipeapp"
                    />
                  </div>

                  <div>
                    <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                      App Version
                    </label>
                    <input
                      id="version"
                      name="version"
                      type="text"
                      value={formData.version}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="1.0.0"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="contact@yourapp.com"
                    />
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      id="api_key"
                      name="api_key"
                      type="text"
                      value={formData.api_key}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="your-api-key-here"
                    />
                  </div>
                </div>
              </div>

              {/* Links & URLs */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Links & URLs</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="privacy_policy_url" className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Policy URL
                    </label>
                    <input
                      id="privacy_policy_url"
                      name="privacy_policy_url"
                      type="url"
                      value={formData.privacy_policy_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="https://yoursite.com/privacy"
                    />
                  </div>

                  <div>
                    <label htmlFor="terms_url" className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions URL
                    </label>
                    <input
                      id="terms_url"
                      name="terms_url"
                      type="url"
                      value={formData.terms_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="https://yoursite.com/terms"
                    />
                  </div>

                  <div>
                    <label htmlFor="more_apps_url" className="block text-sm font-medium text-gray-700 mb-2">
                      More Apps URL
                    </label>
                    <input
                      id="more_apps_url"
                      name="more_apps_url"
                      type="url"
                      value={formData.more_apps_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="https://play.google.com/store/apps/dev?id=..."
                    />
                  </div>

                  <div>
                    <label htmlFor="youtube_channel" className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Channel ID
                    </label>
                    <input
                      id="youtube_channel"
                      name="youtube_channel"
                      type="text"
                      value={formData.youtube_channel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="UCxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* About Text */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About App</h2>
                <div>
                  <label htmlFor="about_text" className="block text-sm font-medium text-gray-700 mb-2">
                    About Text
                  </label>
                  <textarea
                    id="about_text"
                    name="about_text"
                    value={formData.about_text}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter information about your app..."
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
