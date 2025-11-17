'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function AddAppPage() {
  const router = useRouter();
  
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [fcmServerKey, setFcmServerKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: appName, package_name: packageName, fcm_server_key: fcmServerKey })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('App added successfully!');
        setTimeout(() => {
          router.push('/dashboard/apps');
        }, 1500);
      } else {
        alert('Failed to add app');
        setSaving(false);
      }
    } catch (err) {
      alert('Failed to add app');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/apps" style={{ color: '#2196f3', textDecoration: 'none' }}>Apps</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Add App</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit}>
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>ADD NEW APP</h2>
              <div>
                <Link href="/dashboard/apps">
                  <button type="button" className="button button-rounded btn-offset waves-effect" style={{ marginRight: '10px' }}>
                    CANCEL
                  </button>
                </Link>
                <button type="submit" disabled={saving} className="button button-rounded btn-offset bg-blue waves-effect">
                  {saving ? 'SAVING...' : 'SUBMIT'}
                </button>
              </div>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {message && (
                <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                  {message}
                </div>
              )}

              <div className="row clearfix">
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>App Name *</b></div>
                      <input type="text" className="form-control" value={appName} onChange={(e) => setAppName(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Package Name *</b></div>
                      <input type="text" className="form-control" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="com.example.app" required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>FCM Server Key *</b></div>
                      <textarea className="form-control" value={fcmServerKey} onChange={(e) => setFcmServerKey(e.target.value)} rows={4} required></textarea>
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
