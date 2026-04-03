import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { QuizProvider } from './store/QuizContext';
import { LangProvider } from './store/LangContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login, Register, ForgotPassword } from './pages/Auth';
import { MyQuizzes } from './pages/MyQuizzes';
import { CreateQuiz } from './pages/CreateQuiz';
import { TakeQuiz } from './pages/TakeQuiz';
import { QuizResult } from './pages/QuizResult';
import { Library, Settings } from './pages/LibrarySettings';
import { ResetPassword } from './pages/ResetPassword';
import { Spinner } from './components/ui';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const { isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">EduQuiz</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <main className="pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/library" element={<Library />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/result/:id" element={<QuizResult />} />
          <Route path="/my-quizzes" element={<ProtectedRoute><MyQuizzes /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <LangProvider>
    <AuthProvider>
      <QuizProvider>
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </QuizProvider>
    </AuthProvider>
  </LangProvider>
);

export default App;
