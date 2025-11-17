'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

interface AdsSettings {
  ad_status: string;
  ad_type: string;
  backup_ads: string;
  admob_publisher_id: string;
  admob_app_id: string;
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
  applovin_banner_zone_id: string;
  applovin_banner_mrec_zone_id: string;
  applovin_interstitial_zone_id: string;
  ironsource_app_key: string;
  ironsource_banner_placement_name: string;
  ironsource_interstitial_placement_name: string;
  wortise_app_id: string;
  wortise_banner_unit_id: string;
  wortise_interstitial_unit_id: string;
  wortise_native_unit_id: string;
  wortise_app_open_unit_id: string;
  interstitial_ad_interval: number;
  native_ad_interval: number;
  native_ad_index: number;
}

interface AdsPlacement {
  banner_home: number;
  banner_post_details: number;
  banner_category_details: number;
  banner_search: number;
  interstitial_post_list: number;
  interstitial_post_details: number;
  native_ad_home: number;
  native_ad_post_list: number;
  native_ad_post_details: number;
  native_ad_exit_dialog: number;
  app_open_ad_on_start: number;
  app_open_ad_on_resume: number;
}

export default function AdsPage() {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  const [placement, setPlacement] = useState<AdsPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        setPlacement(data.placement || {
          banner_home: 1,
          banner_post_details: 1,
          banner_category_details: 1,
          banner_search: 1,
          interstitial_post_list: 1,
          interstitial_post_details: 1,
          native_ad_home: 1,
          native_ad_post_list: 1,
          native_ad_post_details: 1,
          native_ad_exit_dialog: 1,
          app_open_ad_on_start: 1,
          app_open_ad_on_resume: 1
        });
      }
    } catch (err) {
      console.error('Failed to load ads settings');
      toast.error('Failed to load ads settings');
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
        body: JSON.stringify({ ...settings, placement })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Changes saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AdsSettings, value: string | number) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const togglePlacement = (field: keyof AdsPlacement) => {
    if (placement) {
      setPlacement({ ...placement, [field]: placement[field] === 1 ? 0 : 1 });
    }
  };

  if (loading || !settings || !placement) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px', padding: '10px 0' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Manage Ads</li>
      </ol>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>MANAGE ADS</h2>
              <button type="submit" disabled={saving} className="button button-rounded btn-offset bg-blue waves-effect">
                {saving ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {/* Ad Status */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600' }}>Ad Status</label>
                <select 
                  className="form-control" 
                  value={settings.ad_status} 
                  onChange={(e) => handleInputChange('ad_status', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                >
                  <option value="on">ON</option>
                  <option value="off">OFF</option>
                </select>
              </div>

              {settings.ad_status === 'on' && (
                <>
                  {/* PRIMARY ADS */}
                  <div style={{ marginBottom: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>PRIMARY ADS</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600' }}>Primary Ad Network</label>
                      <select 
                        className="form-control" 
                        value={settings.ad_type} 
                        onChange={(e) => handleInputChange('ad_type', e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                      >
                        <option value="admob">AdMob</option>
                        <option value="google_ad_manager">Google Ad Manager</option>
                        <option value="startapp">StartApp</option>
                        <option value="unity">Unity Ads</option>
                        <option value="applovin_discovery">AppLovin Discovery</option>
                        <option value="applovin">AppLovin MAX</option>
                        <option value="ironsource">ironSource</option>
                        <option value="fan">Meta Audience Network</option>
                        <option value="wortise">Wortise</option>
                      </select>
                      <p style={{ fontSize: '11px', color: '#337ab7', marginTop: '5px' }}>The main ads you want to use and display in the application.</p>
                    </div>

                    {/* AdMob Fields */}
                    {settings.ad_type === 'admob' && (
                      <div style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>AdMob Configuration</h4>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob Publisher ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_publisher_id} 
                            onChange={(e) => handleInputChange('admob_publisher_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob App ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_app_id} 
                            onChange={(e) => handleInputChange('admob_app_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                            placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
                          />
                          <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Important: Your AdMob App ID must be added in AndroidManifest.xml</p>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob Banner Ad Unit ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_banner_unit_id} 
                            onChange={(e) => handleInputChange('admob_banner_unit_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                            placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                          />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob Interstitial Ad Unit ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_interstitial_unit_id} 
                            onChange={(e) => handleInputChange('admob_interstitial_unit_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob Native Ad Unit ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_native_unit_id} 
                            onChange={(e) => handleInputChange('admob_native_unit_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>AdMob App Open Ad Unit ID</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={settings.admob_app_open_ad_unit_id} 
                            onChange={(e) => handleInputChange('admob_app_open_ad_unit_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Add other ad network configurations similarly */}
                  </div>

                  {/* BACKUP ADS */}
                  <div style={{ marginBottom: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>BACKUP ADS</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600' }}>Backup Ad Network</label>
                      <select 
                        className="form-control" 
                        value={settings.backup_ads} 
                        onChange={(e) => handleInputChange('backup_ads', e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                      >
                        <option value="none">None</option>
                        <option value="admob">AdMob</option>
                        <option value="google_ad_manager">Google Ad Manager</option>
                        <option value="startapp">StartApp</option>
                        <option value="unity">Unity Ads</option>
                        <option value="applovin_discovery">AppLovin Discovery</option>
                        <option value="applovin">AppLovin MAX</option>
                        <option value="ironsource">ironSource</option>
                        <option value="fan">Meta Audience Network</option>
                        <option value="wortise">Wortise</option>
                      </select>
                      <p style={{ fontSize: '11px', color: '#337ab7', marginTop: '5px' }}>Backup ads network. The Backup Ads will show when the Primary Ads fail to load.</p>
                    </div>
                  </div>

                  {/* GLOBAL CONFIGURATION */}
                  <div style={{ paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>GLOBAL CONFIGURATION</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Interstitial Ad Interval</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={settings.interstitial_ad_interval} 
                          onChange={(e) => handleInputChange('interstitial_ad_interval', parseInt(e.target.value))}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                        />
                        <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Show ad every X clicks</p>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Native Ad Interval</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={settings.native_ad_interval} 
                          onChange={(e) => handleInputChange('native_ad_interval', parseInt(e.target.value))}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                        />
                        <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Ad spacing in list</p>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Native Ad Index</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={settings.native_ad_index} 
                          onChange={(e) => handleInputChange('native_ad_index', parseInt(e.target.value))}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                        />
                        <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>First ad position</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </form>

        {/* Ads Placement Sidebar */}
        {settings.ad_status === 'on' && (
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>ADS PLACEMENT</h2>
            </div>
            <div className="body" style={{ padding: '20px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Enable or Disable Certain Ads Format Separately</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Banner Ads */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Banner Ads</p>
                  {[
                    { key: 'banner_home', label: 'Banner Ad on Home Page' },
                    { key: 'banner_post_details', label: 'Banner Ad on Recipe Details' },
                    { key: 'banner_category_details', label: 'Banner Ad on Category Details' },
                    { key: 'banner_search', label: 'Banner Ad on Search Page' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      onClick={() => togglePlacement(item.key as keyof AdsPlacement)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input 
                        type="checkbox" 
                        checked={placement[item.key as keyof AdsPlacement] === 1}
                        onChange={() => {}}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Interstitial Ads */}
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Interstitial Ads</p>
                  {[
                    { key: 'interstitial_post_list', label: 'Interstitial Ad on Recipe List' },
                    { key: 'interstitial_post_details', label: 'Interstitial on Recipe Details' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      onClick={() => togglePlacement(item.key as keyof AdsPlacement)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input 
                        type="checkbox" 
                        checked={placement[item.key as keyof AdsPlacement] === 1}
                        onChange={() => {}}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Native Ads */}
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Native Ads</p>
                  {[
                    { key: 'native_ad_home', label: 'Native Ad on Home' },
                    { key: 'native_ad_post_list', label: 'Native Ad on Recipe List' },
                    { key: 'native_ad_post_details', label: 'Native Ad on Recipe Details' },
                    { key: 'native_ad_exit_dialog', label: 'Native Ad on Exit Dialog' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      onClick={() => togglePlacement(item.key as keyof AdsPlacement)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input 
                        type="checkbox" 
                        checked={placement[item.key as keyof AdsPlacement] === 1}
                        onChange={() => {}}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* App Open Ads */}
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>App Open Ads</p>
                  {[
                    { key: 'app_open_ad_on_start', label: 'App Open Ad on Start' },
                    { key: 'app_open_ad_on_resume', label: 'App Open Ad on Resume' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      onClick={() => togglePlacement(item.key as keyof AdsPlacement)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input 
                        type="checkbox" 
                        checked={placement[item.key as keyof AdsPlacement] === 1}
                        onChange={() => {}}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
