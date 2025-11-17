'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (searchKeyword = '') => {
    try {
      const url = searchKeyword 
        ? `/api/users?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/users';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(keyword);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('User deleted successfully');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Registered Users</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>REGISTERED USERS</h2>
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
                      <button type="button" onClick={() => { setKeyword(''); fetchUsers(); }} className="button button-rounded waves-effect waves-float">RESET</button>
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

            {!loading && users.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '110%' }}>There are no registered users.</p>
            )}

            {!loading && users.length > 0 && (
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th style={{ width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ verticalAlign: 'middle' }}>{user.name}</td>
                      <td style={{ verticalAlign: 'middle' }}>{user.email}</td>
                      <td style={{ verticalAlign: 'middle' }}>{user.phone}</td>
                      <td style={{ verticalAlign: 'middle' }}>{user.created_at}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Link href={`/dashboard/users/edit/${user.id}`}>
                          <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }}>mode_edit</span>
                        </Link>
                        {' '}
                        <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }} onClick={() => handleDelete(user.id)}>delete</span>
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
