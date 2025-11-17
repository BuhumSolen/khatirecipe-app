'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface AdsSettings {
  publisher_id: string;
  banner_ad_type: string;
  admob_banner_unit_id: string;
  admob_interstitial_unit_id: string;
  admob_native_unit_id: string;
  admob_app_open_ad_unit_id: string;
  ad_manager_banner_unit_id: string;
  ad_manager_interstitial_unit_id: string;
  ad_manager_native_unit_id: string;
  ad_manager_app_open_ad_unit_id: string;
  fan_banner_unit_id: string;
  fan_interstitial_unit_id: string;
  fan_native_unit_id: string;
  startapp_app_id: string;
  unity_game_id: string;
  unity_banner_placement_id: string;
  unity_interstitial_placement_id: string;
  applovin_banner_ad_unit_id: string;
  applovin_interstitial_ad_unit_id: string;
  applovin_native_ad_manual_unit_id: string;
  applovin_app_open_ad_unit_id: string;
  wortise_app_id: string;
  wortise_banner_unit_id: string;
  wortise_interstitial_unit_id: string;
  wortise_native_unit_id: string;
  wortise_app_open_unit_id: string;
  interstitial_ad_interval: number;
  native_ad_interval: number;
  native_ad_index: number;
}

export default function AdsPage() {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to load ads settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/ads', {
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

  const handleInputChange = (field: keyof AdsSettings, value: string | number) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading || !settings) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Ads Settings</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit}>
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>ADS SETTINGS</h2>
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

              {/* Banner Ad Type */}
              <div className="row clearfix" style={{ marginBottom: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>BANNER AD TYPE</div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Banner Ad Type</b></div>
                      <select className="form-control show-tick" value={settings.banner_ad_type} onChange={(e) => handleInputChange('banner_ad_type', e.target.value)}>
                        <option value="admob">ADMOB</option>
                        <option value="google_ad_manager">GOOGLE AD MANAGER</option>
                        <option value="fan">FAN</option>
                        <option value="startapp">STARTAPP</option>
                        <option value="unity">UNITY</option>
                        <option value="applovin">APPLOVIN</option>
                        <option value="applovin_max">APPLOVIN MAX</option>
                        <option value="wortise">WORTISE</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* AdMob */}
              <div className="row clearfix" style={{ marginBottom: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>ADMOB</div>
                
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>AdMob Publisher Id</b></div>
                      <input type="text" className="form-control" value={settings.publisher_id} onChange={(e) => handleInputChange('publisher_id', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>AdMob Banner Ad Unit Id</b></div>
                      <input type="text" className="form-control" value={settings.admob_banner_unit_id} onChange={(e) => handleInputChange('admob_banner_unit_id', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>AdMob Interstitial Ad Unit Id</b></div>
                      <input type="text" className="form-control" value={settings.admob_interstitial_unit_id} onChange={(e) => handleInputChange('admob_interstitial_unit_id', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>AdMob Native Ad Unit Id</b></div>
                      <input type="text" className="form-control" value={settings.admob_native_unit_id} onChange={(e) => handleInputChange('admob_native_unit_id', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>AdMob App Open Ad Unit Id</b></div>
                      <input type="text" className="form-control" value={settings.admob_app_open_ad_unit_id} onChange={(e) => handleInputChange('admob_app_open_ad_unit_id', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad Intervals */}
              <div className="row clearfix" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                <div className="col-sm-12" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>AD INTERVALS</div>
                
                <div className="col-sm-4">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Interstitial Ad Interval</b></div>
                      <input type="number" className="form-control" value={settings.interstitial_ad_interval} onChange={(e) => handleInputChange('interstitial_ad_interval', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Native Ad Interval</b></div>
                      <input type="number" className="form-control" value={settings.native_ad_interval} onChange={(e) => handleInputChange('native_ad_interval', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Native Ad Index</b></div>
                      <input type="number" className="form-control" value={settings.native_ad_index} onChange={(e) => handleInputChange('native_ad_index', parseInt(e.target.value))} />
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
