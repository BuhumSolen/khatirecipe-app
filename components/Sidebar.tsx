'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  username?: string;
  email?: string;
}

export default function Sidebar({ username = 'admin', email = 'admin@example.com' }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/dashboard/categories', icon: 'view_list', label: 'Category' },
    { path: '/dashboard/featured', icon: 'star', label: 'Featured' },
    { path: '/dashboard/recipes', icon: 'restaurant', label: 'Recipes' },
    { path: '/dashboard/ads', icon: 'monetization_on', label: 'Ads' },
    { path: '/dashboard/notifications', icon: 'notifications', label: 'Notification' },
    { path: '/dashboard/admin', icon: 'people', label: 'Administrator' },
    { path: '/dashboard/settings', icon: 'settings', label: 'Settings' },
    { path: '/dashboard/apps', icon: 'adb', label: 'Manage Apps' },
  ];

  return (
    <aside className="sidebar">
      {/* User Info */}
      <div className="user-info" style={{ padding: '20px', background: '#2196f3', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Image 
            src="/ic_launcher.png" 
            alt="App Icon" 
            width={40} 
            height={40}
            style={{ borderRadius: '4px' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>{username}</div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>{email}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="menu">
        <ul className="list">
          <li className="header">MENU</li>
          {menuItems.map((item) => (
            <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
              <Link href={item.path}>
                <span className="material-icons">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/login">
              <span className="material-icons">power_settings_new</span>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="legal" style={{ padding: '20px', borderTop: '1px solid #e0e0e0', fontSize: '12px', color: '#666' }}>
        <div className="copyright">
          &copy; 2024 Your Recipes App
        </div>
        <div className="version" style={{ marginTop: '8px' }}>
          <b>Version:</b> 4.0.0
        </div>
      </div>
    </aside>
  );
}
