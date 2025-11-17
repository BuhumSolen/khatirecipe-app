'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface Recipe {
  recipe_id: number;
  recipe_title: string;
  recipe_time: string;
  recipe_image: string;
  video_id: string;
  content_type: string;
  category_name: string;
  total_views: number;
}

export default function FeaturedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchKeyword = '') => {
    try {
      const url = searchKeyword 
        ? `/api/recipes/featured?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/recipes/featured';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (err) {
      console.error('Failed to load featured recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(keyword);
  };

  const handleRemove = async (id: number) => {
    if (!confirm('Remove from featured recipes?')) return;

    try {
      const response = await fetch(`/api/recipes/${id}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: 0 })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Removed from featured recipes');
        fetchRecipes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to remove from featured');
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Featured Recipes</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>FEATURED RECIPES</h2>
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
                      <button type="button" onClick={() => { setKeyword(''); fetchRecipes(); }} className="button button-rounded waves-effect waves-float">RESET</button>
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

            {!loading && recipes.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '110%' }}>There are no featured recipes.</p>
            )}

            {!loading && recipes.length > 0 && (
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Recipe Name</th>
                    <th style={{ width: '1%' }}>Image</th>
                    <th style={{ width: '15%' }}>Time</th>
                    <th style={{ width: '10%' }}>Category</th>
                    <th style={{ width: '5%' }}><center>View</center></th>
                    <th style={{ width: '5%' }}><center>Type</center></th>
                    <th style={{ width: '25%' }}><center>Action</center></th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.recipe_id}>
                      <td style={{ verticalAlign: 'middle' }}>{recipe.recipe_title}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {recipe.content_type === 'youtube' ? (
                          <img className="img-corner-radius" style={{ objectFit: 'cover' }} src={`https://img.youtube.com/vi/${recipe.video_id}/mqdefault.jpg`} height="60" width="80" />
                        ) : (
                          <img className="img-corner-radius" style={{ objectFit: 'cover' }} src={`/upload/${recipe.recipe_image}`} height="60" width="80" />
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>{recipe.recipe_time}</td>
                      <td style={{ verticalAlign: 'middle' }}>{recipe.category_name}</td>
                      <td style={{ verticalAlign: 'middle' }}><center>{recipe.total_views}</center></td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <center>
                          {recipe.content_type === 'Post' ? (
                            <span className="label label-rounded bg-blue" style={{ background: '#2196f3', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px' }}>RECIPE</span>
                          ) : (
                            <span className="label label-rounded bg-orange" style={{ background: '#ff9800', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px' }}>VIDEO</span>
                          )}
                        </center>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <center>
                          <Link href={`/dashboard/recipes/detail/${recipe.recipe_id}`}>
                            <span className="material-icons" style={{ cursor: 'pointer', color: '#666', marginRight: '8px' }}>launch</span>
                          </Link>
                          <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }} onClick={() => handleRemove(recipe.recipe_id)}>delete</span>
                        </center>
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
