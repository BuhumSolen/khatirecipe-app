'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';

interface Category {
  cid: number;
  category_name: string;
  category_image: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (searchKeyword = '') => {
    try {
      const url = searchKeyword 
        ? `/api/categories?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/categories';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Failed to load categories');
      }
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories(keyword);
  };

  const handleReset = () => {
    setKeyword('');
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Category deleted successfully');
        fetchCategories();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Manage Category</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>MANAGE CATEGORY</h2>
            <Link href="/dashboard/categories/add">
              <button type="button" className="button button-rounded btn-offset waves-effect waves-float">
                ADD NEW CATEGORY
              </button>
            </Link>
          </div>

          <div className="body table-responsive" style={{ padding: '20px', marginTop: '-10px' }}>
            
            {message && (
              <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                <button type="button" className="close" onClick={() => setMessage('')}>
                  <span>&times;</span>
                </button>
                {message}
              </div>
            )}

            {/* Search Form */}
            <form onSubmit={handleSearch} id="form_validation">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <div className="form-group form-float">
                        <div className="form-line">
                          <input
                            type="text"
                            className="form-control"
                            name="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search..."
                            required
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '1%' }}>
                      <button type="button" onClick={handleReset} className="button button-rounded waves-effect waves-float">
                        RESET
                      </button>
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

            {loading && (
              <p style={{ textAlign: 'center', fontSize: '110%', padding: '20px' }}>Loading...</p>
            )}

            {!loading && categories.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '110%', padding: '20px' }}>There are no categories.</p>
            )}

            {!loading && categories.length > 0 && (
              <table className="table table-hover table-striped table-offset">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th style={{ width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.cid}>
                      <td style={{ verticalAlign: 'middle' }}>{category.category_name}</td>
                      <td>
                        <img
                          className="img-corner-radius"
                          style={{ objectFit: 'cover' }}
                          src={`/upload/category/${category.category_image}`}
                          alt={category.category_name}
                          width="80"
                          height="60"
                        />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Link href={`/dashboard/categories/edit/${category.cid}`}>
                          <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }}>mode_edit</span>
                        </Link>
                        {' '}
                        <span 
                          className="material-icons" 
                          style={{ cursor: 'pointer', color: '#666' }}
                          onClick={() => handleDelete(category.cid)}
                        >
                          delete
                        </span>
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
