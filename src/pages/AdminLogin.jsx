import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Lock, AlertCircle, LogIn } from 'lucide-react';

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
        // Demo login mode when .env is not configured yet
        sessionStorage.setItem('demo_admin_authenticated', 'true');
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ongeldig e-mailadres of wachtwoord. Controleer uw gegevens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-md bg-blue-900 text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Instructeur Portaal</h1>
            <p className="text-xs text-slate-500">
              Beheer proefles-aanvragen en lespakketten
            </p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-5 p-3.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Demo Modus:</strong> Supabase omgevingsvariabelen (<code>.env</code>) zijn nog niet gekoppeld. Klik op Inloggen om het dashboard lokaal te testen.
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              E-mailadres
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@klaverdrive.nl"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-slate-800 mb-1"
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
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-950 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Bezig met inloggen...' : 'Inloggen op Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

