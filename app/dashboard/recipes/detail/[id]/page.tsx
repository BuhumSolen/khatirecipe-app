'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useParams } from 'next/navigation';

interface Recipe {
  recipe_id: number;
  recipe_title: string;
  recipe_time: string;
  recipe_image: string;
  video_id: string;
  content_type: string;
  recipe_description: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setRecipe(data.data);
      }
    } catch (err) {
      console.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  if (!recipe) {
    return <DashboardLayout><p>Recipe not found</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/recipes" style={{ color: '#2196f3', textDecoration: 'none' }}>Manage Recipes</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Recipes Detail</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>RECIPES DETAIL</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href={`/dashboard/recipes/edit/${recipe.recipe_id}`}>
                <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }}>mode_edit</span>
              </Link>
              <span className="material-icons" style={{ cursor: 'pointer', color: '#666' }}>delete</span>
            </div>
          </div>

          <div className="body" style={{ padding: '30px' }}>
            
            <div className="row clearfix">
              <div className="col-sm-12">
                
                <h4>{recipe.recipe_title}</h4>
                
                <p>{recipe.recipe_time}</p>

                {recipe.content_type === 'youtube' ? (
                  <p><img className="img-corner-radius" style={{ maxWidth: '40%' }} src={`https://img.youtube.com/vi/${recipe.video_id}/mqdefault.jpg`} /></p>
                ) : (
                  <p><img className="img-corner-radius" style={{ maxWidth: '40%' }} src={`/upload/${recipe.recipe_image}`} /></p>
                )}

                <div dangerouslySetInnerHTML={{ __html: recipe.recipe_description }} />

              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
