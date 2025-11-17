'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useParams } from 'next/navigation';

export default function EditNotificationPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (id) {
      fetchNotification();
    }
  }, [id]);

  const fetchNotification = async () => {
    try {
      const response = await fetch(`/api/notifications/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setTitle(data.data.title);
        setMessage(data.data.message);
        setLink(data.data.link);
        setCurrentImage(data.data.image);
      }
    } catch (err) {
      console.error('Failed to load notification');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('link', link);
      formData.append('old_image', currentImage);
      if (image) formData.append('image', image);

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMsg('Changes Saved...');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('Failed to update notification');
      }
    } catch (err) {
      alert('Failed to update notification');
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
        <li><Link href="/dashboard/notifications" style={{ color: '#2196f3', textDecoration: 'none' }}>Notification</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Edit Template</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>EDIT NOTIFICATION TEMPLATE</h2>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {successMsg && (
                <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                  <button type="button" className="close" onClick={() => setSuccessMsg('')}><span>&times;</span></button>
                  {successMsg}
                </div>
              )}

              <div className="row clearfix">
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Title *</b></div>
                      <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Message *</b></div>
                      <textarea className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required></textarea>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="form-line">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Link</b></div>
                      <input type="url" className="form-control" value={link} onChange={(e) => setLink(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  {currentImage && (
                    <div style={{ marginBottom: '15px' }}>
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Current Image</b></div>
                      <img src={`/upload/notification/${currentImage}`} alt="Current" style={{ maxWidth: '200px', borderRadius: '6px' }} />
                    </div>
                  )}
                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Change Image (Optional)</b></div>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                  </div>
                </div>

                <div className="col-sm-12" style={{ marginTop: '20px' }}>
                  <Link href="/dashboard/notifications">
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
