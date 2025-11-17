'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface License {
  code: string;
  response: string;
  support_until: string;
  license_type: string;
  status: string;
}

export default function LicensePage() {
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchLicense();
  }, []);

  const fetchLicense = async () => {
    try {
      const response = await fetch('/api/license');
      const data = await response.json();
      
      if (data.success && data.data) {
        setLicense(data.data);
        setCode(data.data.code);
      }
    } catch (err) {
      console.error('Failed to load license');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/license/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('License verified successfully!');
        fetchLicense();
      } else {
        setError(data.error || 'Failed to verify license');
      }
    } catch (err) {
      setError('Failed to verify license');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>License</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>LICENSE</h2>
          </div>

          <div className="body" style={{ padding: '30px' }}>
            
            {message && (
              <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px', background: '#e3f2fd', borderColor: '#90caf9', color: '#1976d2', padding: '12px 20px', borderRadius: '6px' }}>
                <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-dismissible corner-radius" style={{ marginBottom: '20px', background: '#ffebee', borderColor: '#ef9a9a', color: '#c62828', padding: '12px 20px', borderRadius: '6px' }}>
                <button type="button" className="close" onClick={() => setError('')}><span>&times;</span></button>
                {error}
              </div>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {license && license.status === 'active' ? (
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ background: '#e8f5e9', border: '1px solid #81c784', borderRadius: '6px', padding: '20px', marginBottom: '20px' }}>
                      <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>check_circle</span>
                        License Active
                      </h3>
                      <p style={{ margin: 0, color: '#388e3c', fontSize: '14px' }}>Your license is currently active and valid.</p>
                    </div>

                    <table className="table" style={{ marginBottom: '0' }}>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: '600', width: '30%' }}>Purchase Code:</td>
                          <td>{license.code}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: '600' }}>License Type:</td>
                          <td style={{ textTransform: 'capitalize' }}>{license.license_type}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: '600' }}>Support Until:</td>
                          <td>{license.support_until}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: '600' }}>Status:</td>
                          <td>
                            <span className="label label-rounded" style={{ background: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', textTransform: 'uppercase' }}>
                              {license.status}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <form onSubmit={handleVerify}>
                    <div className="row clearfix">
                      <div className="col-sm-12">
                        <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '6px', padding: '20px', marginBottom: '20px' }}>
                          <h3 style={{ color: '#ef6c00', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>
                            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>info</span>
                            License Verification Required
                          </h3>
                          <p style={{ margin: 0, color: '#e65100', fontSize: '14px' }}>
                            Please enter your Envato Item Purchase Code to activate your license.
                          </p>
                        </div>

                        <div className="form-group">
                          <div className="form-line">
                            <div className="font-12" style={{ marginBottom: '8px', fontWeight: '600' }}><b>Envato Item Purchase Code</b></div>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={code} 
                              onChange={(e) => setCode(e.target.value)}
                              placeholder="Enter your purchase code"
                              required 
                            />
                          </div>
                          <div className="help-info" style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                            <a href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code-" target="_blank" style={{ color: '#2196f3' }}>
                              Where is my purchase code?
                            </a>
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={verifying}
                          className="button button-rounded bg-blue waves-effect" 
                          style={{ marginTop: '10px' }}
                        >
                          {verifying ? 'VERIFYING...' : 'VERIFY LICENSE'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
