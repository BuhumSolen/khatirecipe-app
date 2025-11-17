'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useParams } from 'next/navigation';

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setName(data.data.name);
        setEmail(data.data.email);
        setPhone(data.data.phone);
      }
    } catch (err) {
      console.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Changes Saved...');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Failed to update user');
      }
    } catch (err) {
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/users" style={{ color: '#2196f3', textDecoration: 'none' }}>Registered Users</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Edit User</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit}>
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>EDIT USER</h2>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {message && (
                <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                  <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                  {message}
                </div>
              )}

              <div className="row clearfix">
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Name *</b></div>
                      <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Email *</b></div>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Phone</b></div>
                      <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12" style={{ marginTop: '20px' }}>
                  <Link href="/dashboard/users">
                    <button type="button" className="button button-rounded waves-effect" style={{ marginRight: '10px' }}>
                      CANCEL
                    </button>
                  </Link>
                  <button type="submit" disabled={saving} className="button button-rounded bg-blue waves-effect">
                    {saving ? 'UPDATING...' : 'UPDATE'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
