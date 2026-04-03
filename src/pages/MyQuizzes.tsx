import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/QuizContext';
import { useAuth } from '../store/AuthContext';
import { useLang } from '../store/LangContext';
import { QuizCard } from '../components/QuizCard';
import { Button, Modal, Spinner } from '../components/ui';
import { PlusCircle, Trash2, RotateCcw, Trash } from 'lucide-react';

export const MyQuizzes: React.FC = () => {
  const { quizzes, deleteQuiz, restoreQuiz, permanentDeleteQuiz, togglePublishQuiz, isLoading } = useQuizStore();
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [showTrash, setShowTrash] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ id: string; permanent: boolean } | null>(null);

  if (!user) return null;

  const activeQuizzes = quizzes.filter(q => !q.deletedAt);
  const trashedQuizzes = quizzes.filter(q => q.deletedAt);
  const displayed = showTrash ? trashedQuizzes : activeQuizzes;

  const handleDelete = async () => {
    if (!deleteModal) return;
    if (deleteModal.permanent) await permanentDeleteQuiz(deleteModal.id);
    else await deleteQuiz(deleteModal.id);
    setDeleteModal(null);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t.myQuizzes}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{activeQuizzes.length} {t.questions}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTrash(!showTrash)}>
            <Trash2 className="h-4 w-4" />{showTrash ? t.myQuizzes : t.trash}
            {trashedQuizzes.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{trashedQuizzes.length}</span>}
          </Button>
          <Button size="sm" onClick={() => navigate('/create')}>
            <PlusCircle className="h-4 w-4" />{t.createQuiz}
          </Button>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl">{showTrash ? '🗑️' : '📝'}</div>
          <p className="text-slate-500 dark:text-slate-400">{showTrash ? (t.lang === 'vi' ? 'Thùng rác trống' : 'Trash is empty') : t.noQuizzes}</p>
          {!showTrash && <Button onClick={() => navigate('/create')}><PlusCircle className="h-4 w-4" />{t.createQuiz}</Button>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map(quiz => (
            <div key={quiz.id} className="relative">
              <QuizCard
                quiz={quiz}
                onClick={() => !showTrash && navigate(`/quiz/${quiz.id}`)}
                showActions
                onTogglePublish={!showTrash ? () => togglePublishQuiz(quiz.id, !quiz.isPublic) : undefined}
                onDelete={() => setDeleteModal({ id: quiz.id, permanent: showTrash })}
              />
              {showTrash && (
                <button onClick={() => restoreQuiz(quiz.id)}
                  className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors">
                  <RotateCcw className="h-3 w-3" />{t.restoreQuiz}
                </button>
              )}
              {!showTrash && (
                <button onClick={() => navigate(`/edit/${quiz.id}`)}
                  className="absolute top-3 right-16 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                  ✏️
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title={deleteModal?.permanent ? (t.lang === 'vi' ? 'Xóa vĩnh viễn?' : 'Delete permanently?') : t.deleteQuiz}>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {deleteModal?.permanent
            ? (t.lang === 'vi' ? 'Quiz này sẽ bị xóa vĩnh viễn và không thể khôi phục.' : 'This quiz will be permanently deleted.')
            : (t.lang === 'vi' ? 'Quiz sẽ được chuyển vào thùng rác.' : 'Quiz will be moved to trash.')}
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={() => setDeleteModal(null)}>{t.cancel}</Button>
          <Button variant="danger" onClick={handleDelete}>{deleteModal?.permanent ? <><Trash className="h-4 w-4" />{t.delete}</> : <><Trash2 className="h-4 w-4" />{t.delete}</>}</Button>
        </div>
      </Modal>
    </div>
  );
};
