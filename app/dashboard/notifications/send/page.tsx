'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function SendNotificationPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Send notification to all users?')) return;
    
    setSending(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('link', link);
      if (image) formData.append('image', image);

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMsg('Notification sent successfully!');
        setTitle('');
        setMessage('');
        setLink('');
        setImage(null);
      } else {
        alert('Failed to send notification');
      }
    } catch (err) {
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Send Notification</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>SEND NOTIFICATION</h2>
              <button type="submit" disabled={sending} className="button button-rounded btn-offset bg-blue waves-effect">
                {sending ? 'SENDING...' : 'SEND'}
              </button>
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
                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Image</b></div>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
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
