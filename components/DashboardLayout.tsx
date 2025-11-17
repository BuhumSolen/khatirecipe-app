'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="theme-blue poppins">
      <Sidebar />
      <Navbar />
      <section className="content">
        {children}
      </section>
    </div>
  );
}
