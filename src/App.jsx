import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteSettingsProvider } from './lib/siteSettings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LegalAndCookies from './components/LegalAndCookies';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Exact launch time: Tomorrow (10 Nov 2026) at 13:50:00 CET (Europe/Amsterdam)
export const LAUNCH_TIMESTAMP = new Date('2026-11-10T13:50:00+01:00').getTime();

function isPreviewMode() {
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('preview') === '1') return true;
  const hashQueryIndex = window.location.hash.indexOf('?');
  if (hashQueryIndex !== -1) {
    const hashParams = new URLSearchParams(window.location.hash.slice(hashQueryIndex));
    if (hashParams.get('preview') === '1') return true;
  }
  return false;
}

function LaunchGate({ children }) {
  const [isLive, setIsLive] = useState(
    () => Date.now() >= LAUNCH_TIMESTAMP || isPreviewMode()
  );

  useEffect(() => {
    if (isLive) return undefined;
    const timer = setInterval(() => {
      if (Date.now() >= LAUNCH_TIMESTAMP || isPreviewMode()) {
        setIsLive(true);
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [isLive]);

  if (!isLive) {
    return <ComingSoon />;
  }

  return children;
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <HashRouter>
        <Routes>
          {/* Public Customer Website (shows ComingSoon until 13:50 tomorrow) */}
          <Route
            path="/"
            element={
              <LaunchGate>
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                  <Navbar />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                  <LegalAndCookies />
                </div>
              </LaunchGate>
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
