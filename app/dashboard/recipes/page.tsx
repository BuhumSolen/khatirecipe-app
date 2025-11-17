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
  featured: number;
  total_views: number;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchKeyword = '') => {
    try {
      const url = searchKeyword 
        ? `/api/recipes?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/recipes';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (err) {
      console.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(keyword);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recipes.map(r => r.recipe_id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Whoops! no recipes selected to delete');
      return;
    }

    if (!confirm('Are you sure want to delete all selected recipes?')) return;

    try {
      const response = await fetch('/api/recipes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`${selectedIds.length} Selected recipes deleted`);
        setSelectedIds([]);
        setSelectAll(false);
        fetchRecipes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Error deleting records');
    }
  };

  const toggleFeatured = async (id: number, currentStatus: number) => {
    const action = currentStatus === 0 ? 'add' : 'remove';
    if (!confirm(action === 'add' ? 'Add to featured recipes?' : 'Remove from featured recipes?')) return;

    try {
      const response = await fetch(`/api/recipes/${id}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: currentStatus === 0 ? 1 : 0 })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(action === 'add' ? 'Success added to featured recipes' : 'Removed from featured recipes');
        fetchRecipes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure want to delete this Recipe?')) return;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Recipe deleted successfully');
        fetchRecipes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Manage Recipes</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>MANAGE RECIPES</h2>
            <Link href="/dashboard/recipes/add">
              <button type="button" className="button button-rounded btn-offset waves-effect waves-float">
                ADD NEW RECIPES
              </button>
            </Link>
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

            {!loading && recipes.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '110%' }}>There are no recipes.</p>
            ) : (
              <>
                <div style={{ marginLeft: '8px', marginTop: '-36px', marginBottom: '10px' }}>
                  <button type="button" onClick={handleDeleteSelected} className="button button-rounded waves-effect waves-float">
                    Delete selected items(s)
                  </button>
                </div>

                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: '1%' }}>
                        <div style={{ marginBottom: '-15px' }}>
                          <input id="chk_all" type="checkbox" className="filled-in chk-col-blue" checked={selectAll} onChange={handleSelectAll} />
                          <label htmlFor="chk_all"></label>
                        </div>
                      </th>
                      <th style={{ width: '35%' }}>Recipe Name</th>
                      <th style={{ width: '1%' }}>Image</th>
                      <th style={{ width: '15%' }}>Time</th>
                      <th style={{ width: '10%' }}>Category</th>
                      <th style={{ width: '5%' }}>Featured</th>
                      <th style={{ width: '5%' }}><center>View</center></th>
                      <th style={{ width: '5%' }}><center>Type</center></th>
                      <th style={{ width: '25%' }}><center>Action</center></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((recipe) => (
                      <tr key={recipe.recipe_id}>
                        <td style={{ verticalAlign: 'middle', width: '1%' }}>
                          <div style={{ marginTop: '10px' }}>
                            <input type="checkbox" id={`chk-${recipe.recipe_id}`} className="chkbox filled-in chk-col-blue" checked={selectedIds.includes(recipe.recipe_id)} onChange={() => handleSelect(recipe.recipe_id)} />
                            <label htmlFor={`chk-${recipe.recipe_id}`}></label>
                          </div>
                        </td>
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
                        <td style={{ verticalAlign: 'middle' }}>
                          <center>
                            <span className="material-icons" style={{ color: recipe.featured === 0 ? 'grey' : '#2196f3', cursor: 'pointer' }} onClick={() => toggleFeatured(recipe.recipe_id, recipe.featured)}>lens</span>
                          </center>
                        </td>
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
                            <Link href={`/dashboard/recipes/send/${recipe.recipe_id}`}>
                              <span className="material-icons" style={{ cursor: 'pointer', color: '#666', marginRight: '8px' }}>notifications_active</span>
                            </Link>
                            <Link href={`/dashboard/recipes/detail/${recipe.recipe_id}`}>
                              <span className="material-icons" style={{ cursor: 'pointer', color: '#666', marginRight: '8px' }}>launch</span>
                            </Link>
                            <Link href={`/dashboard/recipes/edit/${recipe.recipe_id}`}>
                              <span className="material-icons" style={{ cursor: 'pointer', color: '#666', marginRight: '8px' }}>mode_edit</span>
                            </Link>
                            <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }} onClick={() => handleDelete(recipe.recipe_id)}>delete</span>
                          </center>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
