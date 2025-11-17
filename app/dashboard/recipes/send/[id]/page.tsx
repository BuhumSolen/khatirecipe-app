'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useParams, useRouter } from 'next/navigation';

interface Recipe {
  recipe_id: number;
  recipe_title: string;
}

export default function SendNotificationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

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
    }
  };

  const handleSend = async () => {
    if (!confirm('Send notification for this recipe?')) return;
    
    setSending(true);

    try {
      const response = await fetch(`/api/recipes/${id}/send-notification`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Notification sent successfully!');
        setTimeout(() => {
          router.push('/dashboard/recipes');
        }, 2000);
      } else {
        alert('Failed to send notification');
        setSending(false);
      }
    } catch (err) {
      alert('Failed to send notification');
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li><Link href="/dashboard/recipes" style={{ color: '#2196f3', textDecoration: 'none' }}>Manage Recipes</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Send Notification</li>
      </ol>

      <div style={{ padding: '0' }}>
        <div className="card corner-radius">
          <div className="header" style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>SEND NOTIFICATION</h2>
          </div>

          <div className="body" style={{ padding: '30px' }}>
            
            {message && (
              <div className="alert alert-info alert-dismissible corner-radius" style={{ marginBottom: '20px' }}>
                {message}
              </div>
            )}

            {recipe && (
              <div>
                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                  Send push notification for: <strong>{recipe.recipe_title}</strong>
                </p>

                <button 
                  type="button" 
                  onClick={handleSend}
                  disabled={sending}
                  className="button button-rounded bg-blue waves-effect"
                >
                  {sending ? 'SENDING...' : 'SEND NOTIFICATION'}
                </button>

                <Link href="/dashboard/recipes">
                  <button type="button" className="button button-rounded waves-effect" style={{ marginLeft: '10px' }}>
                    CANCEL
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
