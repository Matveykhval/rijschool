import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Lock, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate('/admin', { replace: true });
      });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;
        navigate('/admin', { replace: true });
      } else {
        sessionStorage.setItem('demo_admin_authenticated', 'true');
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ongeldig e-mailadres of wachtwoord.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-900">
      <div className="w-full max-w-sm bg-white rounded-md shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-200">
          <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">
              KlaverDrive Admin
            </h1>
            <p className="text-xs text-slate-500 mt-1">Beheeromgeving</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              E-mailadres
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="karahan_kizil@hotmail.com"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Wachtwoord
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Terug naar publieke website
      </Link>
    </div>
  );
}
