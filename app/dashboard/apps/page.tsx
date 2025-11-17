'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface App {
  id: number;
  app_name: string;
  package_name: string;
  fcm_server_key: string;
  created_at: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async (searchKeyword = '') => {
    try {
      const url = searchKeyword 
        ? `/api/apps?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/apps';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setApps(data.data);
      }
    } catch (err) {
      console.error('Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps(keyword);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure want to delete this app?')) return;

    try {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('App deleted successfully');
        fetchApps();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to delete app');
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Manage Apps</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>MANAGE APPS</h2>
            <Link href="/dashboard/apps/add">
              <button type="button" className="button button-rounded btn-offset waves-effect waves-float">
                ADD NEW APP
              </button>
            </Link>
          </div>

          <div className="body table-responsive" style={{ padding: '20px', marginTop: '-10px' }}>
            
            {message && (
              <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                {message}
              </div>
            )}

            <form onSubmit={handleSearch}>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <div className="form-group form-float">
                        <div className="form-line">
                          <input type="text" className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." required />
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '1%' }}>
                      <button type="button" onClick={() => { setKeyword(''); fetchApps(); }} className="button button-rounded waves-effect waves-float">RESET</button>
                    </td>
                    <td style={{ width: '1%' }}>
                      <button type="submit" className="btn bg-blue btn-circle waves-effect waves-circle waves-float" style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-icons">search</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            {loading && <p style={{ textAlign: 'center', fontSize: '110%' }}>Loading...</p>}

            {!loading && apps.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '110%' }}>There are no apps.</p>
            )}

            {!loading && apps.length > 0 && (
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>App Name</th>
                    <th>Package Name</th>
                    <th>FCM Server Key</th>
                    <th style={{ width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.id}>
                      <td style={{ verticalAlign: 'middle' }}>{app.app_name}</td>
                      <td style={{ verticalAlign: 'middle' }}>{app.package_name}</td>
                      <td style={{ verticalAlign: 'middle', wordWrap: 'break-word' }}>{app.fcm_server_key ? app.fcm_server_key.substring(0, 50) + '...' : ''}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Link href={`/dashboard/apps/edit/${app.id}`}>
                          <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }}>mode_edit</span>
                        </Link>
                        {' '}
                        <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }} onClick={() => handleDelete(app.id)}>delete</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
