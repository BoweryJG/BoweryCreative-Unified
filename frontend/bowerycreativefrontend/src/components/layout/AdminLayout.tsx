import React from 'react';
import { AdminNavigation } from '../AdminNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-obsidian">
      <AdminNavigation />
      <main className="pt-16">
        <div className="container-luxury py-8">
          {children}
        </div>
      </main>
    </div>
  );
};