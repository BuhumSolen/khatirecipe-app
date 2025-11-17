'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function APIKeyPage() {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    if (!confirm('Generate new API key? This will invalidate the current key.')) return;
    
    setGenerating(true);

    try {
      const response = await fetch('/api/settings/generate-api-key', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`New API Key generated: ${data.apiKey}`);
      } else {
        alert('Failed to generate API key');
      }
    } catch (err) {
      alert('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/settings" style={{ color: '#2196f3', textDecoration: 'none' }}>Settings</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Change API Key</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>CHANGE API KEY</h2>
          </div>

          <div className="body" style={{ padding: '30px' }}>
            
            {message && (
              <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                {message}
              </div>
            )}

            <p style={{ marginBottom: '20px' }}>Click the button below to generate a new REST API key for your application.</p>

            <button 
              type="button" 
              onClick={handleGenerate}
              disabled={generating}
              className="button button-rounded bg-blue waves-effect"
            >
              {generating ? 'GENERATING...' : 'GENERATE NEW API KEY'}
            </button>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
