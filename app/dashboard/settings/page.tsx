'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface Settings {
  app_fcm_key: string;
  api_key: string;
  package_name: string;
  onesignal_app_id: string;
  onesignal_rest_api_key: string;
  providers: string;
  fcm_notification_topic: string;
  privacy_policy: string;
  youtube_api_key: string;
  more_apps_url: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Changes saved...');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading || !settings) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Settings</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit}>
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>SETTINGS</h2>
              <button type="submit" disabled={saving} className="button button-rounded btn-offset bg-blue waves-effect">
                {saving ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {message && (
                <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                  <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                  {message}
                </div>
              )}

              <div className="row clearfix" style={{ marginBottom: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>KEYS & IDS</div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Rest API Key</b></div>
                      <input type="text" className="form-control" value={settings.api_key} onChange={(e) => handleInputChange('api_key', e.target.value)} readOnly />
                    </div>
                    <div className="help-info pull-left">
                      <Link href="/dashboard/api-key"><span className="label label-rounded bg-blue" style={{ background: '#2196f3', color: 'white', padding: '6px 14px', borderRadius: '12px', fontSize: '11px', display: 'inline-block', marginTop: '5px' }}>CHANGE API KEY</span></Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>YouTube API Key</b></div>
                      <input type="text" className="form-control" value={settings.youtube_api_key} onChange={(e) => handleInputChange('youtube_api_key', e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Package Name</b></div>
                      <input type="text" className="form-control" value={settings.package_name} onChange={(e) => handleInputChange('package_name', e.target.value)} required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px', marginBottom: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>NOTIFICATION</div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Notification Provider</b></div>
                      <select className="form-control show-tick" value={settings.providers} onChange={(e) => handleInputChange('providers', e.target.value)} required>
                        <option value="">Select Notification Provider</option>
                        <option value="onesignal">OneSignal</option>
                        <option value="fcm">FCM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>OneSignal App ID</b></div>
                      <input type="text" className="form-control" value={settings.onesignal_app_id} onChange={(e) => handleInputChange('onesignal_app_id', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>OneSignal REST API Key</b></div>
                      <input type="text" className="form-control" value={settings.onesignal_rest_api_key} onChange={(e) => handleInputChange('onesignal_rest_api_key', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>FCM Server Key</b></div>
                      <input type="text" className="form-control" value={settings.app_fcm_key} onChange={(e) => handleInputChange('app_fcm_key', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>FCM Notification Topic</b></div>
                      <input type="text" className="form-control" value={settings.fcm_notification_topic} onChange={(e) => handleInputChange('fcm_notification_topic', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>OTHER SETTINGS</div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Privacy Policy URL</b></div>
                      <input type="url" className="form-control" value={settings.privacy_policy} onChange={(e) => handleInputChange('privacy_policy', e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>More Apps URL</b></div>
                      <input type="url" className="form-control" value={settings.more_apps_url} onChange={(e) => handleInputChange('more_apps_url', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
