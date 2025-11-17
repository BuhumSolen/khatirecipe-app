'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="bars" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              // Toggle sidebar on mobile
              const sidebar = document.querySelector('.sidebar');
              sidebar?.classList.toggle('open');
            }}
          >
            <span className="material-icons" style={{ color: '#333' }}>menu</span>
          </button>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '18px', textTransform: 'uppercase' }}>
            YOUR RECIPES APP
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard/notifications">
            <span className="material-icons" style={{ color: '#666', cursor: 'pointer' }}>notifications</span>
          </Link>
          <div style={{ position: 'relative' }}>
            <span className="material-icons" style={{ color: '#666', cursor: 'pointer' }}>more_vert</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
