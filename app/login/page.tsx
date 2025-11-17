'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password 
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid Username or Password!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page poppins">
      <div className="login-box">
        <div className="card corner-radius" style={{ background: 'white', padding: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <Image 
                  src="/ic_launcher.png" 
                  alt="App Icon" 
                  width={100} 
                  height={100}
                  style={{ display: 'inline-block' }}
                />
              </div>
              
              <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>
                YOUR RECIPES APP
              </div>
              
              {error && (
                <div style={{ marginBottom: '20px', color: '#E91E63', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div className="input-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <span style={{ padding: '12px', background: '#f5f5f5', borderRight: '1px solid #e0e0e0' }}>
                  <span className="material-icons">person</span>
                </span>
                <div className="form-line" style={{ flex: 1 }}>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <span style={{ padding: '12px', background: '#f5f5f5', borderRight: '1px solid #e0e0e0' }}>
                  <span className="material-icons">lock</span>
                </span>
                <div className="form-line" style={{ flex: 1 }}>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="button button-rounded waves-effect waves-float"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
