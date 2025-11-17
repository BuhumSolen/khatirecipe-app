'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setCategoryName(data.data.category_name);
        setCurrentImage(data.data.category_image);
      }
    } catch (err) {
      console.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCategoryImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      if (categoryImage) {
        formData.append('category_image', categoryImage);
      }

      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Changes Saved...');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Failed to update category');
      }
    } catch (err) {
      alert('Failed to update category');
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
        <li><Link href="/dashboard/categories" style={{ color: '#2196f3', textDecoration: 'none' }}>Manage Category</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Edit Category</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>EDIT CATEGORY</h2>
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
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Category Name *</b></div>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Current Image</b></div>
                    {currentImage && (
                      <img 
                        src={`/upload/category/${currentImage}`}
                        alt="Current" 
                        style={{ maxWidth: '200px', marginBottom: '15px', borderRadius: '6px' }}
                      />
                    )}
                    <div className="font-12" style={{ marginBottom: '8px', marginTop: '15px' }}><b>Change Image (Optional)</b></div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="col-sm-12" style={{ marginTop: '20px' }}>
                  <Link href="/dashboard/categories">
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
