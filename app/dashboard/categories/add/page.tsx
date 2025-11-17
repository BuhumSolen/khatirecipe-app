'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function AddCategoryPage() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Category added successfully!');
        setTimeout(() => {
          router.push('/dashboard/categories');
        }, 1500);
      } else {
        alert('Failed to add category');
        setSaving(false);
      }
    } catch (err) {
      alert('Failed to add category');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/categories" style={{ color: '#2196f3', textDecoration: 'none' }}>Category</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Add Category</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>ADD NEW CATEGORY</h2>
              <div>
                <Link href="/dashboard/categories">
                  <button type="button" className="button button-rounded btn-offset waves-effect" style={{ marginRight: '10px' }}>
                    CANCEL
                  </button>
                </Link>
                <button type="submit" disabled={saving} className="button button-rounded btn-offset bg-blue waves-effect">
                  {saving ? 'SAVING...' : 'SUBMIT'}
                </button>
              </div>
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
                        name="category_name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Category Image *</b></div>
                    <input 
                      type="file" 
                      name="category_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    <div className="help-info" style={{ marginTop: '8px' }}>
                      Recommended size: 200x200 pixels
                    </div>
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
