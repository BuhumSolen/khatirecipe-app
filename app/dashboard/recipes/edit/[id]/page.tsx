'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';

interface Category {
  cid: number;
  category_name: string;
}

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadType, setUploadType] = useState('Post');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeTime, setRecipeTime] = useState('');
  const [catId, setCatId] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  
  // Post type
  const [postImage, setPostImage] = useState<File | null>(null);
  const [optionalImages, setOptionalImages] = useState<File[]>([]);
  
  // YouTube type
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // Url type
  const [urlImage, setUrlImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Upload type
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const recipe = data.data;
        setRecipeTitle(recipe.recipe_title);
        setRecipeTime(recipe.recipe_time);
        setCatId(recipe.cat_id);
        setRecipeDescription(recipe.recipe_description);
        setUploadType(recipe.content_type);
        setCurrentImage(recipe.recipe_image);
        setCurrentVideo(recipe.video_url);
        setCurrentVideoId(recipe.video_id);
        
        if (recipe.content_type === 'youtube') {
          setYoutubeUrl(recipe.video_url || '');
        } else if (recipe.content_type === 'Url') {
          setVideoUrl(recipe.video_url || '');
        }
      }
    } catch (err) {
      console.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('cat_id', catId);
      formData.append('recipe_title', recipeTitle);
      formData.append('recipe_time', recipeTime);
      formData.append('recipe_description', recipeDescription);
      formData.append('upload_type', uploadType);
      formData.append('old_image', currentImage);
      formData.append('old_video', currentVideo);

      if (uploadType === 'Post') {
        if (postImage) formData.append('post_image', postImage);
        optionalImages.forEach((img, idx) => {
          formData.append(`imageoption[${idx}]`, img);
        });
      } else if (uploadType === 'youtube') {
        formData.append('youtube', youtubeUrl);
      } else if (uploadType === 'Url') {
        if (urlImage) formData.append('image', urlImage);
        formData.append('url_source', videoUrl);
      } else if (uploadType === 'Upload') {
        if (uploadImage) formData.append('recipe_image', uploadImage);
        if (videoFile) formData.append('video', videoFile);
      }

      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Changes Saved...');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Failed to update recipe');
        setSaving(false);
      }
    } catch (err) {
      alert('Failed to update recipe');
      setSaving(false);
    }
  };

  const addMoreImages = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setOptionalImages([...optionalImages, file]);
      }
    };
    input.click();
  };

  if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/recipes" style={{ color: '#2196f3', textDecoration: 'none' }}>Manage Recipes</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Edit Recipe</li>
      </ol>

      <div style={{ padding: '0' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card corner-radius">
            <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>EDIT RECIPE</h2>
              <button type="submit" disabled={saving} className="button button-rounded btn-offset bg-blue waves-effect pull-right">
                {saving ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>

            <div className="body" style={{ padding: '30px' }}>
              
              {message && (
                <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                  <button type="button" className="close" onClick={() => setMessage('')}><span>&times;</span></button>
                  {message}
                </div>
              )}

              <div className="row clearfix">
                
                <div className="col-sm-5">

                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Recipe Title *</b></div>
                    <div className="form-line">
                      <input type="text" className="form-control" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Recipe Time *</b></div>
                    <div className="form-line">
                      <input type="text" className="form-control" value={recipeTime} onChange={(e) => setRecipeTime(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Category *</b></div>
                    <select className="form-control show-tick" value={catId} onChange={(e) => setCatId(e.target.value)} required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.cid} value={cat.cid}>{cat.category_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="font-12" style={{ marginBottom: '8px' }}><b>Content Type *</b></div>
                    <select className="form-control show-tick" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                      <option value="Post">Recipes Post</option>
                      <option value="youtube">Recipes Video (YouTube)</option>
                      <option value="Url">Recipes Video (Url)</option>
                      <option value="Upload">Recipes Video (Upload)</option>
                    </select>
                  </div>

                  {/* Current Image Display */}
                  {currentImage && uploadType !== 'youtube' && (
                    <div style={{ marginBottom: '15px' }}>
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Current Image</b></div>
                      <img src={`/upload/${currentImage}`} alt="Current" style={{ maxWidth: '200px', borderRadius: '6px' }} />
                    </div>
                  )}

                  {/* Post Type */}
                  {uploadType === 'Post' && (
                    <div>
                      <div className="font-12 ex1" style={{ marginBottom: '8px' }}><b>Change Image Primary (Optional)</b></div>
                      <div className="form-group">
                        <input type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files?.[0] || null)} />
                      </div>

                      <div>
                        <div className="font-12 ex1" style={{ marginBottom: '8px' }}><b>Add More Images (Optional)</b></div>
                        {optionalImages.map((img, idx) => (
                          <div key={idx} style={{ marginBottom: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                            {img.name}
                          </div>
                        ))}
                        <button type="button" onClick={addMoreImages} className="button button-rounded bg-blue waves-effect">ADD MORE</button>
                      </div>
                    </div>
                  )}

                  {/* YouTube Type */}
                  {uploadType === 'youtube' && (
                    <div className="form-group">
                      <div className="font-12" style={{ marginBottom: '8px' }}><b>Youtube URL *</b></div>
                      <div className="form-line">
                        <input type="text" className="form-control" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=33F5DJw3aiU" required />
                      </div>
                    </div>
                  )}

                  {/* Url Type */}
                  {uploadType === 'Url' && (
                    <div>
                      <div className="form-group">
                        <div className="font-12" style={{ marginBottom: '8px' }}><b>Change Thumbnail (Optional)</b></div>
                        <input type="file" accept="image/*" onChange={(e) => setUrlImage(e.target.files?.[0] || null)} />
                      </div>
                      <div className="form-group">
                        <div className="font-12" style={{ marginBottom: '8px' }}><b>Video URL *</b></div>
                        <div className="form-line">
                          <input type="text" className="form-control" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="http://www.xyz.com/recipe_title.mp4" required />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Type */}
                  {uploadType === 'Upload' && (
                    <div>
                      <div className="form-group">
                        <div className="font-12" style={{ marginBottom: '8px' }}><b>Change Recipe Image (Optional)</b></div>
                        <input type="file" accept="image/*" onChange={(e) => setUploadImage(e.target.files?.[0] || null)} />
                      </div>
                      <div className="form-group">
                        <div className="font-12" style={{ marginBottom: '8px' }}><b>Change Video File (Optional)</b></div>
                        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  )}

                </div>

                <div className="col-sm-7">
                  <div className="font-12" style={{ marginBottom: '8px' }}><b>Description *</b></div>
                  <div className="form-group" style={{ marginTop: '6px' }}>
                    <textarea className="form-control" value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)} cols={60} rows={15} required style={{ minHeight: '400px' }}></textarea>
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
