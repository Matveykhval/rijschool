import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteSettingsProvider } from './lib/siteSettings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LegalAndCookies from './components/LegalAndCookies';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <SiteSettingsProvider>
      <HashRouter>
        <Routes>
          {/* Public Customer Website (with Navbar & Footer) */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
                <LegalAndCookies />
              </div>
            }
          />

          {/* Standalone Admin Routes (No customer Navbar or Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </SiteSettingsProvider>
  );
}
