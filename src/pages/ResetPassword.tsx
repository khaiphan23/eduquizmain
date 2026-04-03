import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useLang } from '../store/LangContext';
import { Button, Input } from '../components/ui';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setSessionReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setSessionReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (password.length < 8) { setError(t.lang === 'vi' ? 'Mật khẩu phải có ít nhất 8 ký tự.' : 'Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError(t.lang === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Passwords do not match.'); return; }
    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (!sessionReady) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-md text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 dark:text-slate-400">{t.lang === 'vi' ? 'Đang xác thực...' : 'Verifying...'}</p>
        <button className="text-indigo-600 underline text-sm" onClick={() => navigate('/forgot-password')}>{t.lang === 'vi' ? 'Yêu cầu lại' : 'Request again'}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center">{t.resetPassword}</h1>
        {success ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center text-green-700 dark:text-green-300">
            {t.lang === 'vi' ? 'Đổi mật khẩu thành công! Đang chuyển hướng...' : 'Password changed! Redirecting...'}
          </div>
        ) : (
          <div className="space-y-4">
            {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}
            <Input type="password" label={t.newPassword} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.lang === 'vi' ? 'Tối thiểu 8 ký tự' : 'At least 8 characters'} />
            <Input type="password" label={t.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSubmit()} />
            <Button onClick={handleSubmit} isLoading={isLoading} className="w-full" disabled={!password || !confirmPassword}>{t.resetPassword}</Button>
            <button onClick={() => navigate('/')} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 text-center">{t.cancel}</button>
          </div>
        )}
      </div>
    </div>
  );
};
