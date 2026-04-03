import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useLang } from '../store/LangContext';
import { Button, Input } from '../components/ui';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../services/supabase';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try { await login(email, password); navigate('/'); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t.login}</h1>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.email}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder={t.password}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">{t.forgotPassword}</Link>
          </div>
          <Button onClick={handleSubmit} isLoading={loading} className="w-full">{t.login}</Button>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t.lang === 'vi' ? 'Chưa có tài khoản?' : "Don't have an account?"}{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">{t.register}</Link>
        </p>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try { await register(name, email, password); navigate('/'); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t.register}</h1>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.name}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.email}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder={t.password}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <Button onClick={handleSubmit} isLoading={loading} className="w-full">{t.register}</Button>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t.lang === 'vi' ? 'Đã có tài khoản?' : 'Already have an account?'}{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">{t.login}</Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPassword: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    const { error: e } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/#/reset-password` });
    if (e) setError(e.message); else setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center">{t.forgotPassword}</h1>
        {sent ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 rounded-xl p-4 text-center text-green-700 dark:text-green-300">
            {t.lang === 'vi' ? 'Email đặt lại mật khẩu đã được gửi!' : 'Reset email sent! Check your inbox.'}
          </div>
        ) : (
          <div className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email} onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSubmit()} />
            <Button onClick={handleSubmit} isLoading={loading} className="w-full">{t.sendReset}</Button>
          </div>
        )}
        <button onClick={() => navigate('/login')} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 text-center">{t.cancel}</button>
      </div>
    </div>
  );
};
