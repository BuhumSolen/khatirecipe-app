'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Stats {
  totalRecipes: number;
  totalCategories: number;
  totalFeatured: number;
  totalNotifications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRecipes: 0,
    totalCategories: 0,
    totalFeatured: 0,
    totalNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'CATEGORY',
      icon: 'view_list',
      count: stats.totalCategories,
      label: 'Categories',
      link: '/dashboard/categories',
      color: '#2196f3'
    },
    {
      title: 'FEATURED',
      icon: 'star',
      count: stats.totalFeatured,
      label: 'Featured',
      link: '/dashboard/featured',
      color: '#2196f3'
    },
    {
      title: 'RECIPES',
      icon: 'restaurant',
      count: stats.totalRecipes,
      label: 'Recipes',
      link: '/dashboard/recipes',
      color: '#2196f3'
    },
    {
      title: 'ADS',
      icon: 'monetization_on',
      label: 'App Monetization',
      link: '/dashboard/ads',
      color: '#2196f3'
    },
    {
      title: 'NOTIFICATION',
      icon: 'notifications',
      count: stats.totalNotifications,
      label: 'Templates',
      link: '/dashboard/notifications',
      color: '#2196f3'
    },
    {
      title: 'ADMINISTRATOR',
      icon: 'people',
      label: 'Admin Panel Privileges',
      link: '/dashboard/admin',
      color: '#2196f3'
    },
    {
      title: 'SETTINGS',
      icon: 'settings',
      label: 'Key and Privacy Settings',
      link: '/dashboard/settings',
      color: '#2196f3'
    },
    {
      title: 'LICENSE',
      icon: 'vpn_key',
      label: 'Envato Item Purchase Code',
      link: '/dashboard/license',
      color: '#2196f3'
    }
  ];

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <ol className="breadcrumb" style={{ display: 'flex', listStyle: 'none', gap: '8px', fontSize: '14px' }}>
        <li><Link href="/dashboard" style={{ color: '#2196f3', textDecoration: 'none' }}>Dashboard</Link></li>
        <li style={{ color: '#666' }}>/</li>
        <li style={{ color: '#666' }}>Home</li>
      </ol>

      {/* Dashboard Cards */}
      <div style={{ padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {cards.map((card, index) => (
            <Link 
              key={index} 
              href={card.link}
              style={{ textDecoration: 'none' }}
            >
              <div 
                className="card corner-radius waves-effect"
                style={{
                  background: card.color,
                  color: 'white',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.title}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span className="material-icons" style={{ fontSize: '48px' }}>{card.icon}</span>
                </div>
                <div style={{ fontSize: '14px', opacity: 0.95 }}>
                  {card.count !== undefined ? `Total ${card.count} ${card.label}` : card.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
